import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import commentRoutes from "./routes/comment.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js";
import path from "path";
dotenv.config();

const app = express();
const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Successfully connectd to MongoDB"))
  .catch((err) => console.log(err));

const __dirname = path.resolve();
app.use(cookieParser());
app.use(express.json());

app.use(cors());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use(express.static(path.join(__dirname, "/front_end/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "front_end", "dist", "index.html"));
});
app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  const msg = err.message || "Internal Server Error !";
  res.status(statusCode).json({
    success: false,
    statusCode,
    msg,
  });
});

app.listen(port, () => console.log(`Server is running on port !${port}`));
