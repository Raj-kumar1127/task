const express = require("express");
const Comment = require("../models/Comment");
const { auth } = require("../middleware/auth");

const router = express.Router();


router.post("/:postId", auth, async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user.id,
      content: req.body.text, 
    });

    await comment.populate("author", "name");

    res.json(comment);
  } catch (error) {
    console.error("Comment creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name")
      .sort({ createdAt: 1 }); // oldest first

    res.json(comments);
  } catch (error) {
    console.error("Fetch comments error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;