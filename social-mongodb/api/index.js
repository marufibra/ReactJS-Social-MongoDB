import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import passport from "passport";
// import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import convRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js";
// import commentRoutes from "./routes/comments.js";
// import likeRoutes from "./routes/likes.js";
// import relationshipRoutes from "./routes/relationships.js";
// import messagesRoutes from "./routes/messages.js";
import { upload } from "./cloudinary.js";
import mongoose from "mongoose";

import "./passport.js";


dotenv.config();

/* -------------------- APP SETUP/ MIDDLEWARE -------------------- */
const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.WEBSOCKET_URL
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));


/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/conversations", convRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/likes", likeRoutes);
// app.use("/api/relationships", relationshipRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/messages", messagesRoutes);

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

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

connectDB();


/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

