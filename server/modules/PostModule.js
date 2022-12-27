import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  description: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  authorId: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "like" }],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
