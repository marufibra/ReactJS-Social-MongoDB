import express from 'express'
import { addConversation, getConversation, getConversationOfTwoUserId } from '../controllers/conversation.js';

const router = express.Router();

router.post("/", addConversation);
router.get("/:userId", getConversation);
router.get("/find/:firstUserId/:secondUserId", getConversationOfTwoUserId);
export default router;