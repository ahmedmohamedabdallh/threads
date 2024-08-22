 import express from "express";
import { followUnFollowUser, getUserProfail, loginUser, logoutUser, signupUser, updatUser,getSuggestedUsers,freezeAccount } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

 const router=express.Router();
 router.get("/profail/:query",getUserProfail)
 router.get("/suggested/",protectRoute,getSuggestedUsers)
 router.post("/signup",signupUser)
 router.post("/login",loginUser)
 router.post("/logout",logoutUser)
 router.post("/follow/:id",protectRoute,followUnFollowUser)
 router.put("/update/:id",protectRoute,updatUser)
 router.put("/freeze",protectRoute,freezeAccount)
 export default router;