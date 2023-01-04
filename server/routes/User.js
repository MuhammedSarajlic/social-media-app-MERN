import express from "express";
const app = express();
import { getUser } from "../controllers/User.js";

app.get("/get-user", getUser);

export default app;
