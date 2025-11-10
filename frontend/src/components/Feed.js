import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config'; // ✅ Import the live backend URL

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
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
    if (!token) return alert('Please login first.');
    try {
      await axios.post(
        `${API_URL}/api/posts`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      fetchPosts();
    } catch (err) {
      alert('Post failed');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Welcome, Rohit</h2>
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
          <div key={p._id} className="post">
            <strong>{p.userName}</strong>
            <p>{p.content}</p>
            <small>{new Date(p.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
