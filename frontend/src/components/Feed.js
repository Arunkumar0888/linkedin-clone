import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function Feed(){
  const [posts,setPosts] = useState([]);
  const [content,setContent] = useState('');
  const [loading,setLoading] = useState(true);

  const API = (process.env.REACT_APP_API_BASE || 'http://localhost:5000') + '/api';

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API + '/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchPosts(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login');
    try {
      await axios.post(API + '/posts', { content }, { headers: { Authorization: `Bearer ${token}` }});
      setContent('');
      fetchPosts();
    } catch (err) {
      alert('Post failed');
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Welcome, Rohit</h2>
        <form onSubmit={submit}>
          <textarea placeholder="What's on your mind?" value={content} onChange={e=>setContent(e.target.value)} required />
          <button type="submit">Post</button>
        </form>
      </div>

      <div>
        <h3>Feed</h3>
        {loading && <p>Loading...</p>}
        {posts.map(p => (
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
