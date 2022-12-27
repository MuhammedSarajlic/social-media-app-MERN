import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
config();
const app = express();

import { loginStrategy, registerStrategy } from "./routes/index.js";
import jwt from "jsonwebtoken";
import Post from "./modules/PostModule.js";

const PORT = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", registerStrategy);

app.post("/login", loginStrategy);

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
    const post = await Post.find().sort({ createdAt: -1 }).populate("authorId");
    res.send(post);
  } catch (error) {
    res.status(500).send(error.message);
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
