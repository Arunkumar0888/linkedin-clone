import express from "express";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// simple auth middleware for protected routes
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content, image } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const user = await User.findById(req.user.id);
    const post = new Post({ userId: user._id, userName: user.name, content, image: image || null });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
