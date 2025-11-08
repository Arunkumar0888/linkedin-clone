import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post((process.env.REACT_APP_API_BASE || 'http://localhost:5000') + '/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/feed');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
