import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
config();
const app = express();

import User from "./modules/UserModule.js";

const PORT = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    imageUrl: req.body.imageUrl,
  });
  const createdUser = await newUser.save();
  res.json(createdUser);
});

connect(process.env.MONGODB_URL).then(() => {
  console.log("Success on port 5000");
  app.listen(PORT);
});
