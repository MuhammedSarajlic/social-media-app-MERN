import express from "express";
const app = express();
import {
  sendRequest,
  checkRequest,
  removeRequest,
  statusOfRequest,
} from "../controllers/FriendRequest.js";

app.post("/send", sendRequest);
app.get("/:id/check", checkRequest);
app.delete("/remove", removeRequest);
app.patch("/status", statusOfRequest);

export default app;
