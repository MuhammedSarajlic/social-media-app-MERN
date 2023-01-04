import express from "express";
const app = express();
import { createPost, getPosts, getPostById } from "../controllers/Post.js";

app.post("/create-post", createPost);
app.get("/get-posts", getPosts);
app.get("/posts/:id/get", getPostById);

export default app;
