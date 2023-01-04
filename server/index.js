import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
config();
import bodyParser from "body-parser";
const app = express();

import { loginStrategy, registerStrategy } from "./routes/index.js";
import jwt from "jsonwebtoken";
import Post from "./modules/PostModule.js";
import Comment from "./modules/CommentModule.js";
import User from "./modules/UserModule.js";
import FriendRequest from "./modules/FriendRequestModule.js";
import Notification from "./modules/NotificationModule.js";

import postRoutes from "./routes/Post.js";
import followRoutes from "./routes/Follow.js";

const PORT = 5000;

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api", postRoutes);
app.use("/api/users", followRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", registerStrategy);

app.post("/login", loginStrategy);

/********** user routes *************/

app.get("/api/get-user", async (req, res) => {
  try {
    const { prop } = req.query;
    const user = await User.findOne({
      $or: [{ username: prop }, { email: prop }],
    });
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/********** like routes *************/

app.post("/api/posts/:id/add-like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    if (post.likes.includes(userId)) {
      return res.status(400).send({ error: "Post already liked" });
    }
    post.likes.push(userId);
    await post.save();
    res.send({ message: "Post liked" });
  } catch (error) {
    res.status(500).send({ error: "Error liking post" });
  }
});

app.delete("/api/posts/:id/remove-like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      return res.status(400).send({ error: "Post not liked" });
    }
    post.likes.splice(index, 1);
    await post.save();
    res.send({ message: "Post unliked" });
  } catch (error) {
    res.status(500).send({ error: "Error unliking post" });
  }
});

app.get("/api/posts/:id/check-like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send("Post not found!");
    }
    res.send(post.likes.includes(userId));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/********** comment routes *************/

app.get("/api/posts/:id/get-comments", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "comments",
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: "userId",
      },
    });
    res.send(post.comments);
  } catch (error) {
    res.status(500).send({ error: "Error fetching comments" });
  }
});

app.post("/api/posts/:id/add-comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    const newComment = await Comment.create({ userId, comment });
    await Post.findByIdAndUpdate(
      id,
      { $push: { comments: newComment._id } },
      { new: true }
    );
    res.send(newComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/api/posts/:id/remove-comment", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndUpdate(
      { comments: id },
      { $pull: { comments: id } },
      { new: true }
    );
    if (!post) {
      return res.status(404).send({ error: "Comment not found" });
    }
    await Comment.findByIdAndDelete(id);
    res.send({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

/********** friend request routes *************/

app.post("/api/friend-request/send", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId, receiverId, status: "pending" },
        { senderId: receiverId, receiverId: senderId, status: "pending" },
      ],
    });
    if (existingRequest) {
      return res.status(400).send({ error: "Friend request already exists" });
    }
    const friendRequest = new FriendRequest({
      senderId,
      receiverId,
    });
    await friendRequest.save();
    res.send(friendRequest);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/api/friend-request/:id/check", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { senderId: userId, receiverId: id, status: "pending" },
        { senderId: id, receiverId: userId, status: "pending" },
      ],
    });
    res.send(friendRequest || null);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/api/friend-request/remove", async (req, res) => {
  const { senderId, receiverId } = req.body;
  await FriendRequest.deleteOne({ senderId, receiverId, status: "pending" });
  res.send("request deleted");
});

app.patch("/api/friend-request/status", async (req, res) => {
  try {
    const { senderId, receiverId, status } = req.body;
    const request = await FriendRequest.findOneAndUpdate(
      { senderId, receiverId, status: "pending" },
      { $set: { status } },
      { new: true }
    );
    if (!request) {
      return res.status(404).send({ error: "Friend request not found" });
    }
    if (status === "accepted") {
      await User.updateOne(
        { _id: senderId },
        { $push: { friends: receiverId } }
      );
      await User.updateOne(
        { _id: receiverId },
        { $push: { friends: senderId } }
      );
      res.send({ status: "accepted" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/********** friend routes *************/

app.delete("/api/friend/remove", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    await User.updateMany(
      { _id: { $in: [senderId, receiverId] } },
      { $pull: { friends: { $in: [senderId, receiverId] } } }
    );
    res.send("Removed friend");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/********** notifications routes *************/

app.get("/api/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.find({ receiverId: id }).populate(
      "senderId"
    );
    res.send(notification);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/api/notifications/remove", async (req, res) => {
  try {
    const { senderId, receiverId, type } = req.body;
    await Notification.findOneAndDelete({ senderId, receiverId, type });
    await User.findByIdAndUpdate(
      receiverId,
      { $pull: { notifications: notification._id } },
      { new: true }
    );
    res.send("Notification removed");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/notifications/send", async (req, res) => {
  try {
    const { senderId, receiverId, message, type, postId } = req.body;
    const notification = new Notification({
      senderId,
      receiverId,
      type,
      message,
      postId,
    });
    await notification.save();
    await User.findByIdAndUpdate(
      receiverId,
      { $push: { notifications: notification._id } },
      { new: true }
    );
    res.send(notification);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/********** auth routes *************/

// app.post("/api/protected", (req, res) => {
//   const token = req.body.headers.Authorization;
//   const user = jwt.verify(token, process.env.JWT_SECRET);
//   res.send({ user });
// });

const verifyToken = (req, res, next) => {
  try {
    const token = req.body.headers.Authorization;
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

app.post("/api/protected", verifyToken, (req, res) => {
  res.send({ user: req.user });
});

mongoose.set("strictQuery", false);
connect(process.env.MONGODB_URL).then(() => {
  console.log("Success on port 5000");
  app.listen(PORT);
});
