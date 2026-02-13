import React from "react";
import API from "../services/api";
import { useAuth } from "../context/authContext";
import CommentSection from "./CommentSection";
import AdminReplySection from "./AdminReplySection";

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
    }
  };

  const authorId =
    typeof post.author === "object"
      ? post.author?._id
      : post.author;

  const imageUrl = post.image
    ? `http://localhost:5000/uploads/${post.image}`
    : null;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 transition hover:shadow-xl duration-300 border border-gray-100">

      {/* Header */}
      <div className="flex justify-between items-start">

        {/* Author Info */}
        <div className="flex items-center space-x-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {post.author?.name
              ? post.author.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <h4 className="font-semibold text-gray-800">
              {post.author?.name || "Unknown User"}
            </h4>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Delete Button */}
        {user &&
          authorId &&
          user._id.toString() === authorId.toString() && (
            <button
              onClick={handleDelete}
              className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full hover:bg-red-100 transition"
            >
              Delete
            </button>
        )}
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="text-xl font-bold text-gray-900 mt-4">
          {post.title}
        </h3>
      )}

      {/* Content */}
      <p className="text-gray-700 mt-2 leading-relaxed">
        {post.content}
      </p>

      {/* Image */}
      {imageUrl && (
        <div className="mt-4 overflow-hidden rounded-2xl">
          <img
            src={imageUrl}
            alt="Post"
            className="w-full max-h-[400px] object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Divider */}
      <div className="border-t my-5"></div>

      {/* Comments & Replies */}
      <div className="space-y-4">
        <AdminReplySection postId={post._id} />
        <CommentSection postId={post._id} />
      </div>
    </div>
  );
};

export default PostCard;