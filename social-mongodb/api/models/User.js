import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 255,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc:{
        type: String,
        maxlength: 50,
    },
    city: {
        type: String,
        maxlength: 50,
    },
    from: {
        type: String,
        maxlength: 50,
    },
    relationship:{
        type: Number,
        enum: [1,2,3],
    },
    google_id:{
        type: String,
        maxlength: 255,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
