const express = require("express");
const Comment = require("../models/Comment");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/:postId", auth, async (req, res) => {
  const comment = await Comment.create({
    post: req.params.postId,
    author: req.user.id,
    content: req.body.content
  });
  res.json(comment);
});

router.get("/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "name");
  res.json(comments);
});

module.exports = router;