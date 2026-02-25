import express from 'express'
import { 
    addMessage, 
    getMessages,
    updateMessageStatus,
    updateReadMessages,
    updateDeliveredMessage,
    getUnreadMessages
} from '../controllers/message.js';

const router = express.Router();

router.post("/", addMessage);
router.get("/:conversationId", getMessages);
router.put("/:id/status",updateMessageStatus)
router.put("/read/:conversationId",updateReadMessages);
router.put("/delivered/:userId",updateDeliveredMessage);
router.get("/unread/:userId", getUnreadMessages);

export default router;