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

app.post("/create-post", async (req, res) => {
  const { description, imageUrl, authorId } = req.body;
  const user = await User.findOne({ authorId });
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
    const post = await Post.find().sort({ createdAt: -1 }).populate("authorId");
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
    console.log(index);
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

app.get("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  Post.findById(id, (error, post) => {
    if (error) {
      return res.status(500).send({ error: "Error getting post" });
    }
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    const liked = post.likes.includes(userId);
    res.send({ liked });
  });
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
