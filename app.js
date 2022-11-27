import express from "express";
import User from "./routers/User.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use("/api/v1", User);

app.get("/", (req, res) => {
  res.send("Server is working");
});