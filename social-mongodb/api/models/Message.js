import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    replyId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    img: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);