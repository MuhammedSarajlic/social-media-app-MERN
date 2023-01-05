import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
config();
const app = express();
const PORT = 5000;

import {
  loginStrategy,
  registerStrategy,
  postRoutes,
  followRoutes,
  userRoutes,
  likeRoutes,
  commentRoutes,
  friendRequestRoutes,
  friendRoutes,
  notificationRoutes,
} from "./routes/index.js";
import jwt from "jsonwebtoken";

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api", postRoutes);
app.use("/api/users", followRoutes);
app.use("/api", userRoutes);
app.use("/api/posts", likeRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/friend-request", friendRequestRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/notifications", notificationRoutes);
app.post("/register", registerStrategy);
app.post("/login", loginStrategy);

app.get("/", (req, res) => {
  res.send("Hello");
});

const verifyToken = (req, res, next) => {
  try {
    const token = req.body.headers.Authorization;
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

app.post("/api/protected", verifyToken, (req, res) => {
  res.send({ user: req.user });
});

mongoose.set("strictQuery", false);
connect(process.env.MONGODB_URL).then(() => {
  console.log("Success on port 5000");
  app.listen(PORT);
});
