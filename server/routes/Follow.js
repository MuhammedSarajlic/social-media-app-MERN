import express from "express";
const app = express();
import { follow, unfollow } from "../controllers/Follow.js";

app.post("/:id/follow", follow);
app.post("/:id/unfollow", unfollow);

export default app;
