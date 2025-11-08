import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await axios.post((process.env.REACT_APP_API_BASE || 'http://localhost:5000') + '/api/auth/signup', { name, email, password });
      navigate('/');
    } catch (err) {
      setErr(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      <form onSubmit={submit}>
        <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
