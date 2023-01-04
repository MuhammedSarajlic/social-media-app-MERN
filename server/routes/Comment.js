import express from "express";
const app = express();
import {
  getComments,
  addComment,
  removeComment,
} from "../controllers/Comment.js";

app.get("/:id/get-comments", getComments);
app.post("/:id/add-comment", addComment);
app.delete("/:id/remove-comment", removeComment);

export default app;
