import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        maxLength: 500
    },
    img: {
        type: String,
    },
    like: {
        type:[ mongoose.Schema.Types.ObjectId],
        ref:"User",
        default:[],
    },
    replaies: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true
        },
        userProfailPic: {
            type: String,
        },
        username: {
            type: String
        }
    }]

}, {
    timestamps: true
})
const Post = mongoose.model("Post", postSchema)
export default Post