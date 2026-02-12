const express = require("express");
const Post = require("../models/Post");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const post = await Post.create({
    author: req.user.id,
    content: req.body.content
  });
  res.json(post);
});

router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "name");
  res.json(posts);
});

module.exports = router;