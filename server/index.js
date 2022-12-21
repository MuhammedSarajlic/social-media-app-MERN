import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import bcrypt from "bcrypt";
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
  try {
    const { firstName, lastName, email, password, imageUrl } = req.body;
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .send({ error: "User with this email already exist" });
    }
    if (password.length < 8) {
      return res.status(400).send({ error: "Password is too short" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      imageUrl,
    });
    await newUser.save();
    res.send("User created");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

connect(process.env.MONGODB_URL).then(() => {
  console.log("Success on port 5000");
  app.listen(PORT);
});
