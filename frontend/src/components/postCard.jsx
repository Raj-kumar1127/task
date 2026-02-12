import React from "react";
import CommentSection from "./CommentSection";
import AdminReplySection from "./AdminReplySection";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">

      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
          {post.author?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">
            {post.author?.name}
          </h4>
          <p className="text-xs text-gray-400">
            Community Member
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        {post.content}
      </p>

      
      <div className="border-t pt-4 space-y-4">

        
        <AdminReplySection postId={post._id} />

       
        <CommentSection postId={post._id} />

      </div>
    </div>
  );
};

export default PostCard;