import User from "../model/userModel.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utilis/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "../model/postModel.js";

//getUserProfail
const getUserProfail = async (req, res) => {
    const { query } = req.params
    try {
       let user;
       if(mongoose.Types.ObjectId.isValid(query)){
        user=await User.findOne({_id:query}).select("-password").select("-updatedAt")
       }else{
        user = await User.findOne({ username:query }).select("-password").select("-updatedAt")
       }
        if (!user) return res.status(400).json({ error: "user not found" })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("error in getUserProfail", error.message);
    }
};

//singup
const signupUser = async (req, res) => {
    try {
        const { name, email, username, password, } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] })
        if (user) return res.status(400).json({ error: "user already exists" })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        })
        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profailPic: newUser.profailPic
            })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("error in singupUser", error.message);

    }
};

//login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')
        if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password" });
        if(user.isFrozen){
            user.isFrozen=false
            await user.save()
        }
        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profailPic: user.profailPic

        })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("error in loginUser", error.message);
    }
};
//logout
const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", '', { maxAge: 1 })
        res.status(200).json({ message: "User logged out successfuly" })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("error in logoutUser", error.message);
    }
};
//followUnFollowUser
const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id)
        if (id == req.user._id.toString()) return res.status(400).json({ error: "You cannot follow/unfollow yourself" })
        if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" })
        const isFollowing = currentUser.following.includes(id)
        if (isFollowing) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            res.status(200).json({ message: "user unfollowed successfuly" })
        } else {
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            res.status(200).json({ message: "user followed successfuly" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("error in followUnFollow User", error.message);
    }
};
//updatUser
const updatUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let { profailPic } = req.body;

    const userId = req.user._id
    try {
        let user = await User.findById(userId)
        if (!user) return res.status(400).json({ error: "user not found" })
    


        if (req.params.id !== userId.toString()) return res.status(400).json({ error: "You cannot updated other user's profail" })
        if (password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword
        }
        if (profailPic) {
            if (user.profailPic) {
                await cloudinary.uploader.destroy(user.profailPic.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profailPic);
            profailPic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profailPic = profailPic || user.profailPic;
        user.bio = bio || user.bio;
        user = await user.save();

        await Post.updateMany(
            {"replaies.userId":userId},{
                $set:{
                    "replaies.$[reply].username":user.username,
                    "replaies.$[reply].userProfailPic":user.profailPic
                }
            },
            {arrayFilters:[{"reply.userId":userId}]}
        )
        user.password=null
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("error in updata User", error.message);
    }
};

const getSuggestedUsers=async(req,res)=>{
    try {
        const userId=req.user._id;
        const usersFollowedByYou=await User.findById(userId).select("following");
        const users=await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId}
                }
            },
            {
                $sample:{size:10}
            }
            
        ])
        const filteredUsers=users.filter(user=> !usersFollowedByYou.following.includes(user._id));
        const suggestedUsers=filteredUsers.slice(0,4);
        suggestedUsers.forEach(user=>user.password=null)
        res.status(200).json(suggestedUsers)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const freezeAccount=async(req,res)=>{
try {
    const user=await User.findById(req.user._id);
    if(!user){
        return res.status(400).json({ error: "User not found"})
    }
    user.isFrozen=true;
    await user.save();
    res.status(200).json({success:true})
} catch (error) {
    res.status(500).json({ error: error.message })
}
}
export { signupUser, loginUser, logoutUser, followUnFollowUser, updatUser, getUserProfail,getSuggestedUsers,freezeAccount }