import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
config();
const app = express();

import { loginStrategy, registerStrategy } from "./routes/index.js";

const PORT = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", registerStrategy);

app.post("/login", loginStrategy);

mongoose.set("strictQuery", false);
connect(process.env.MONGODB_URL).then(() => {
  console.log("Success on port 5000");
  app.listen(PORT);
});
