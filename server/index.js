import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
config();
const app = express();

import { loginStrategy, registerStrategy } from "./routes/index.js";
import jwt from "jsonwebtoken";

const PORT = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", registerStrategy);

app.post("/login", loginStrategy);

app.post("/api/protected", (req, res) => {
  const token = req.body.headers.Authorization;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  res.send({ user });
  console.log(user);
});

mongoose.set("strictQuery", false);
connect(process.env.MONGODB_URL).then(() => {
  console.log("Success on port 5000");
  app.listen(PORT);
});
