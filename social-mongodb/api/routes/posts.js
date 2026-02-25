import express from 'express'
import { addPost,deletePost, updatePost, likePost, getPost, getPosts, getUserPosts } from '../controllers/post.js';

const router = express.Router();

router.get("/:id", getPost);
router.get("/timeline/:userId", getPosts);
router.get("/profile/:username", getUserPosts);
router.post("/", addPost);
router.delete("/:id", deletePost)
router.put("/:id",updatePost)
router.put("/:id/likes",likePost)
export default router;