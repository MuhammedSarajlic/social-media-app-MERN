import express from "express";
const app = express();
import { removeFriend } from "../controllers/Friend.js";

app.delete("/remove", removeFriend);

export default app;
