import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Feed from './components/Feed';

function App() {
  return (
    <Router>
      <div className="topbar">
        <h1>LinkedIn Clone</h1>
        <nav>
          <Link to="/">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/feed">Feed</Link>
        </nav>
      </div>
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
