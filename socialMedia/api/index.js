import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import messagesRoutes from "./routes/messages.js";
import { upload } from "./cloudinary.js";

import "./passport.js";
import { db } from "./connection.js";

dotenv.config();

/* -------------------- APP SETUP -------------------- */
const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* -------------------- HTTP & Socket.IO -------------------- */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

/* -------------------- SOCKET.IO -------------------- */
const onlineUsers = new Map();
io.on("connection", (socket) => {
  socket.on("sendMessage", ({ senderId, receiverId, text, tempId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);

    db.query(
      "INSERT INTO messages (sender_id, receiver_id, text, status) VALUES (?, ?, ?, ?)",
      [
        senderId,
        receiverId,
        text,
        receiverSocketId ? "delivered" : "sent",
      ],
      (err, result) => {
        if (err) {
          console.error("DB error:", err);
          return;
        }

        const messageId = result.insertId;

        // send to receiver
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", {
            id: messageId,
            senderId,
            receiverId,
            text,
            status: "delivered",
          });
        }

        // notify sender (temp → real id)
        io.to(socket.id).emit("messageDelivered", {
          tempId,
          messageId,
        });
      }
    );
  });
});

/* -------------------- UPLOAD -------------------- */
app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.status(200).json({ url: req.file.path });
  });
});

/* -------------------- PASSPORT -------------------- */
app.use(passport.initialize());

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
// app.use("/api/messages", messageRoutes);
app.use("/api/messages", messagesRoutes);

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 8800;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
