import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API = (process.env.REACT_APP_API_BASE || 'http://localhost:5000') + '/api';

  // 🧠 Get current user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user?.name || 'Guest';

  // ❤️ Manage liked posts locally
  const getLikedSet = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem('likedPosts') || '[]'));
    } catch {
      return new Set();
    }
  };
  const saveLikedSet = (set) => {
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(set)));
  };

  const [likedPosts, setLikedPosts] = useState(getLikedSet());

  // 📨 Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API + '/posts');
      // Normalize data so likes always behave as numbers
      const normalized = (res.data || []).map((p) => ({
        ...p,
        likes: Number(p.likes?.length ?? p.likes ?? 0),
        comments: Array.isArray(p.comments)
          ? p.comments
          : p.comments
          ? [p.comments]
          : [],
      }));
      setPosts(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 📝 Create new post
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

  // 👍 Like or Unlike post
  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== id) return p;
        const likedSet = new Set(likedPosts);
        if (likedSet.has(id)) {
          // Unlike
          likedSet.delete(id);
          setLikedPosts(likedSet);
          saveLikedSet(likedSet);
          return { ...p, likes: Math.max(0, Number(p.likes) - 1) };
        } else {
          // Like
          likedSet.add(id);
          setLikedPosts(likedSet);
          saveLikedSet(likedSet);
          return { ...p, likes: Number(p.likes) + 1 };
        }
      })
    );
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div>
      <div className="card">
        <h2>Welcome, {userName}</h2>
        <button onClick={handleLogout} style={{ float: 'right', marginTop: '-30px' }}>
          Logout
        </button>
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
        {posts.map((p) => {
          const isLiked = likedPosts.has(p._id);
          return (
            <div
              key={p._id}
              className="post"
              style={{
                borderBottom: '1px solid #ccc',
                marginBottom: '15px',
                paddingBottom: '10px',
              }}
            >
              <strong>{p.userName}</strong>
              <p>{p.content}</p>
              <small>{new Date(p.createdAt).toLocaleString()}</small>

              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleLike(p._id)}>
                  {isLiked ? '💙 Unlike' : '👍 Like'} ({p.likes || 0})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
