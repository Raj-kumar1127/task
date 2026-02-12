const mongoose = require("mongoose");

const adminReplySchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  isOfficial: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("AdminReply", adminReplySchema);