import express from "express";
import { createPost, deletePost, getFeedPost, getPost, getUserPosts, likeUnlikePost, replayToPost } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router=express.Router();
router.get('/feed',protectRoute,getFeedPost)
router.get('/:id',getPost)
router.get("/user/:username",getUserPosts)
router.post('/create',protectRoute,createPost)
router.delete('/:id',protectRoute,deletePost)
router.put('/like/:id',protectRoute,likeUnlikePost)
router.put('/replay/:id',protectRoute,replayToPost)

export default router;