import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  comment: String,
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
