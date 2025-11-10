import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  const API = (process.env.REACT_APP_API_BASE || 'http://localhost:5000') + '/api';

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userName = user.name || 'User';

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API + '/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login');
    try {
      await axios.post(
        API + '/posts',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      fetchPosts();
    } catch (err) {
      alert('Post failed');
    }
  };

  // Like post (local simulation only)
  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p
      )
    );
  };

  // Add comment (local simulation only)
  const handleComment = (id) => {
    if (!commentText.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              comments: [...(p.comments || []), { text: commentText, userName }],
            }
          : p
      )
    );
    setCommentText('');
  };

  return (
    <div>
      <div className="card">
        <h2>Welcome, {userName}</h2>
        <form onSubmit={submit}>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit">Post</button>
        </form>
      </div>

      <div>
        <h3>Feed</h3>
        {loading && <p>Loading...</p>}
        {posts.map((p) => (
          <div key={p._id} className="post" style={{ borderBottom: '1px solid #ccc', marginBottom: '15px' }}>
            <strong>{p.userName}</strong>
            <p>{p.content}</p>
            <small>{new Date(p.createdAt).toLocaleString()}</small>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleLike(p._id)}>👍 Like ({p.likes || 0})</button>
            </div>

            {/* Comments Section */}
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={() => handleComment(p._id)}>Comment</button>

              {p.comments && p.comments.length > 0 && (
                <ul>
                  {p.comments.map((c, i) => (
                    <li key={i}>
                      <strong>{c.userName}:</strong> {c.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
