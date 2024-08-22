import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getConversations, getMessage, sendMessage } from "../controllers/messageController.js";

const router=express.Router();
router.get('/conversations',protectRoute,getConversations)
router.post('/',protectRoute,sendMessage)
router.get('/:otherUserId',protectRoute,getMessage)

export default router