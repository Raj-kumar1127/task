const express = require("express");
const Post = require("../models/Post");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const Comment = require("../models/Comment")

const router = express.Router();

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.create({
      author: req.user.id,
      title: req.body.title,
      content: req.body.content,
      image: req.file ? req.file.filename : null,
    });

    await post.populate("author", "name");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// router.get("/by-user/:userId", async (req, res) => {
//   try {
//    // console.log("Fetching posts for user:", req.params.userId);

//     const posts = await Post.find({
//       author: req.params.userId,
//     });


//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get("/by-user/:userId", async (req, res) => {
  const posts = await Post.find({ author: req.params.userId })
    .populate("author", "name")
    .lean(); // get plain JS objects

  // Attach comments to each post
  for (let post of posts) {
    const comments = await Comment.find({ post: post._id }).populate("author", "name");
    post.comments = comments;
  }

  res.json(posts);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;