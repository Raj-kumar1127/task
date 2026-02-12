import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/authContext";

const AdminReplySection = ({ postId }) => {
  const { user } = useAuth();
  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState("");

  const fetchReplies = async () => {
    const { data } = await API.get(`/admin-replies/${postId}`);
    setReplies(data);
  };

  useEffect(() => {
    fetchReplies();
  }, [postId]);

  const addReply = async () => {
    if (!content.trim()) return;
    await API.post(`/admin-replies/${postId}`, { content });
    setContent("");
    fetchReplies();
  };

  return (
    <div className="space-y-4">

      
      {replies.map((r) => (
        <div
          key={r._id}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-red-600">
              Official Response
            </span>
            <span className="text-xs text-gray-400">
              Admin
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-700">
            {r.content}
          </p>
        </div>
      ))}

      {user?.role === "admin" && (
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="text"
            value={content}
            placeholder="Write official reply..."
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <button
            onClick={addReply}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminReplySection;