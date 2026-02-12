const express = require("express");
const AdminReply = require("../models/AdminReply");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/:postId", auth, authorize("admin"), async (req, res) => {
  const reply = await AdminReply.create({
    post: req.params.postId,
    admin: req.user.id,
    content: req.body.content
  });
  res.json(reply);
});

router.get("/:postId", async (req, res) => {
  const replies = await AdminReply.find({ post: req.params.postId })
    .populate("admin", "name");
  res.json(replies);
});

module.exports = router;