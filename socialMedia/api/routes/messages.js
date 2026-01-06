import express from "express";
import { db } from "../connection.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// GET chat history between two users
router.get("/:userId", verifyToken, (req, res) => {
  const currentUserId = req.user.id;   // ✅ NOW DEFINED
  const otherUserId = req.params.userId;

  const q = `
    SELECT * FROM messages
    WHERE 
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;

  db.query(
    q,
    [currentUserId, otherUserId, otherUserId, currentUserId],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
});

export default router;
