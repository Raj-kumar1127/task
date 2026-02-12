import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/authContext";

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    const { data } = await API.get(`/comments/${postId}`);
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const addComment = async () => {
    if (!content.trim()) return;
    await API.post(`/comments/${postId}`, { content });
    setContent("");
    fetchComments();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400">
            No comments yet.
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="bg-gray-50 p-3 rounded-xl flex items-start space-x-3"
            >
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600">
                {c.author?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {c.author?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {c.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

     
      {user && (
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="text"
            value={content}
            placeholder="Write a comment..."
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <button
            onClick={addComment}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;