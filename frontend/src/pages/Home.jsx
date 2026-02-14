import axios from "axios";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [commentText, setCommentText] = useState({});

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = storedUser?._id || storedUser?.id;


  const fetchPosts = async () => {
  try {
    const res = await axios.get(
      `https://community1-aps1.onrender.com/api/posts/by-user/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Fetch comments for each post
    const postsWithComments = await Promise.all(
      res.data.map(async (post) => {
        const commentsRes = await axios.get(
          `https://community1-aps1.onrender.com/api/comments/${post._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return { ...post, comments: commentsRes.data };
      })
    );

    setPosts(postsWithComments);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  useEffect(() => {
    if (userId) fetchPosts();
  }, []);

 
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await axios.post("https://community1-aps1.onrender.com/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setContent("");
      setImage(null);
      fetchPosts();
    } catch (error) {
      console.error("Create error:", error.response?.data || error);
    }
  };

 
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://community1-aps1.onrender.com/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
    }
  };

  
  const handleComment = async (postId) => {
    try {
      if (!commentText[postId]) return;

      await axios.post(
        `https://community1-aps1.onrender.com/api/comments/${postId}`,
        { text: commentText[postId] }, // matches backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch (error) {
      console.error("Comment error:", error.response?.data || error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* CREATE POST */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Post</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-2 border rounded-lg bg-gray-50"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Create Post
            </button>
          </form>
        </div>

        {/* POSTS LIST */}
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-2xl shadow-md mb-6 relative">
              {/* DELETE POST */}
              <button
                onClick={() => handleDeletePost(post._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>

              <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
              <p className="text-gray-600 mt-2">{post.content}</p>

              {/* IMAGE */}
              {post.image && (
                <img
                  src={`https://community1-aps1.onrender.com/uploads/${post.image}`}
                  alt="Post"
                  className="w-full mt-4 rounded-lg max-h-96 object-cover"
                />
              )}

              {/* COMMENTS */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-2">Comments</h4>

                {post.comments?.length > 0 ? (
                  post.comments.map((c) => (
                    <div key={c._id} className="bg-gray-100 p-2 rounded-md mb-2 text-sm">
                      <span className="font-semibold">{c.author?.name || "User"}:</span>{" "}
                      {c.content}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No comments yet</p>
                )}

                <div className="flex mt-3 gap-2">
                  <input
                    type="text"
                    placeholder="Add comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [post._id]: e.target.value })
                    }
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-lg transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
