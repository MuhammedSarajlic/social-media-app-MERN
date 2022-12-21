import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";
config();
const app = express();

import User from "./modules/UserModule.js";

const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/register", (req, res) => {});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, imageUrl } = req.body;
    const user = await User.findOne({ email });
    if (user) {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ error: "There is no user with this email" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    req.session.user = user; // store authenticated user in session
    res.send({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

connect(process.env.MONGODB_URL).then(() => {
  console.log("Success on port 5000");
  app.listen(PORT);
});
