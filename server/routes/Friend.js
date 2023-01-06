import express from "express";
const app = express();
import { removeFriend, getFriends } from "../controllers/Friend.js";

app.delete("/remove", removeFriend);
app.get("/:id/get", getFriends);

export default app;
