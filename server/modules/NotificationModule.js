import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["friend request", "like", "follow", "comment"] },
  message: String,
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
