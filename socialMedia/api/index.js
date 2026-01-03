import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import relationshipRoutes from './routes/relationships.js';
import passport from "passport";
import "./passport.js";

import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { upload } from './cloudinary.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: `${process.env.CLIENT_URL}`, // frontend origin
  credentials: true,
}));

app.set("trust proxy", 1);



app.post('/api/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
    console.log("Upload route hit");
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.status(200).json({ url: req.file.path });
  });
});

app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/relationships", relationshipRoutes)

const port = process.env.PORT || 8800;
// process.env.PORT is provided by render.com
app.listen(port, () => {
  console.log("Server is running on port " + port);
});