import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/authContext"; 
import PostCard from "../components/postCard";

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/posts");
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

 
  useEffect(() => {
    if (user) {
      fetchPosts();
    } else {
      setPosts([]);
    }
  }, [user]);

  const createPost = async () => {
    if (!content.trim()) return;

    try {
      await API.post("/posts", { content });
      setContent("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

       
        {user && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-xl p-3 resize-none focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              rows="3"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={createPost}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Post
              </button>
            </div>
          </div>
        )}

       
        <div className="space-y-5">
          {user ? (
            posts.length === 0 ? (
              <p className="text-center text-gray-500">
                No posts yet. Be the first to post!
              </p>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )
          ) : (
            <p className="text-center text-gray-500">
              Please login to see posts.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;