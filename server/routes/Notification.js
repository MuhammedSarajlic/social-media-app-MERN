import express from "express";
const app = express();
import {
  getNotifications,
  removeNotification,
  sendNotification,
} from "../controllers/Notification.js";

app.get("/:id/get", getNotifications);
app.delete("/remove", removeNotification);
app.post("/send", sendNotification);

export default app;
