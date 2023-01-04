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
import userRoutes from "./routes/User.js";
import likeRoutes from "./routes/Like.js";
import commentRoutes from "./routes/Comment.js";
import friendRequestRoutes from "./routes/FriendRequest.js";

const PORT = 5000;

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api", postRoutes);
app.use("/api/users", followRoutes);
app.use("/api", userRoutes);
app.use("/api/posts", likeRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/friend-request", friendRequestRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", registerStrategy);
app.post("/login", loginStrategy);

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
