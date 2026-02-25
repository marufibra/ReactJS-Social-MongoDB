import express from 'express'
import { updateUser, deleteUser, getUser, followUser, unfollowUser, getFriends } from '../controllers/user.js';

const router = express.Router();

router.put("/:id",updateUser);
router.delete("/:id", deleteUser);
router.get("/", getUser);
router.get("/friends/:userId", getFriends);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);

export default router;

