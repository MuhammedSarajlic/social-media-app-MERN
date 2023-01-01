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

const PORT = 5000;

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", registerStrategy);

app.post("/login", loginStrategy);

app.get("/users", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/users/:id/follow", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await User.findById(id);
    const actionUser = await User.findById(userId);
    const isFollower = user.followers.indexOf(userId);
    if (isFollower !== -1) {
      return res.send("Already following user");
    }
    user.followers.push(userId);
    await user.save();
    const isFollowing = actionUser.following.indexOf(id);
    if (isFollowing !== -1) {
      return res.send("Already following user");
    }
    actionUser.following.push(id);
    await actionUser.save();
    res.send({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/users/:id/unfollow", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await User.findById(id);
    const actionUser = await User.findById(userId);
    user.followers = user.followers.filter(
      (follower) => follower.toString() !== userId
    );
    await user.save();
    actionUser.following = actionUser.following.filter(
      (following) => following.toString() !== id
    );
    await actionUser.save();
    res.send("Unfollowed");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/create-post", async (req, res) => {
  const { description, imageUrl, authorId } = req.body;
  try {
    const newPost = new Post({
      description,
      imageUrl,
      authorId,
    });
    await newPost.save();
    res.send("Post created");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/posts", async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate("authorId")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
        },
      });
    res.send(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  Post.findById(id, (error, post) => {
    if (error) {
      return res.status(500).send({ error: "Error liking post" });
    }
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    const index = post.likes.indexOf(userId);
    if (index !== -1) {
      return res.status(400).send({ error: "Post already liked" });
    }
    post.likes.push(userId);
    post.save((error) => {
      if (error) {
        return res.status(500).send({ error: "Error liking post" });
      }
      res.send({ message: "Post liked" });
    });
  });
});

app.delete("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  Post.findById(id, (error, post) => {
    if (error) {
      return res.status(500).send({ error: "Error unliking post" });
    }
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      return res.status(400).send({ error: "Post not liked" });
    }
    post.likes.splice(index, 1);
    post.save((error) => {
      if (error) {
        return res.status(500).send({ error: "Error unliking post" });
      }
      res.send({ message: "Post unliked" });
    });
  });
});

app.get("/api/posts/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send("Post not found!");
    }
    const liked = post.likes.includes(userId);
    res.send({ liked });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/api/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
        },
      });
    res.send(post);
  } catch (error) {}
});

app.post("/api/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    const post = await Post.findById(id);
    const newComment = new Comment({
      userId,
      comment,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res.send(newComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/api/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    await Post.updateOne({ comments: id }, { $pull: { comments: id } });
    res.send({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/api/protected", (req, res) => {
  const token = req.body.headers.Authorization;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  res.send({ user });
});

mongoose.set("strictQuery", false);
connect(process.env.MONGODB_URL).then(() => {
  console.log("Success on port 5000");
  app.listen(PORT);
});
