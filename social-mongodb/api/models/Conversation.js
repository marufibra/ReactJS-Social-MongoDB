import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);


// const ConversationSchema = new mongoose.Schema(
//   {
//     members: {
//         type: Array,
//     },
//   },
//   { timestamps: true }
// );