import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({limit: '5mb'}));

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/linkedin_clone';
mongoose.connect(MONGO)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => res.send("LinkedIn Clone API Running"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
