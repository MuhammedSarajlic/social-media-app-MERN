import express from "express";
const app = express();
import { addLike, removeLike, checkLike } from "../controllers/Like.js";

app.post("/:id/add-like", addLike);
app.delete("/:id/remove-like", removeLike);
app.get("/:id/check-like", checkLike);

export default app;
