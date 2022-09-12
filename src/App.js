import './App.css';
import React, { useState } from 'react';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateTask from './pages/CreateTask';
import ManageTask from './pages/ManageTask';
import ViewSubmissions from './pages/ViewSubmissions';
import Login from './pages/Login';
import { Button } from 'reactstrap';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  
  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        {!isAuth ? 
          (<Link to="/login">Login</Link>) : (
          <>
            <Link to="/createtask">Create Task</Link>
            <Link to="/managetask">Manage Task</Link>
            <Link to="/viewsubmissions">View Submissions</Link>
            <div className="logout"><Button color="warning" outline onClick={handleLogout}>Log Out</Button></div>
          </>
          )}
      </nav>
        <Routes>
          <Route path="/" element={<Home isAuth={isAuth} />} />
          <Route path="/createtask" element={<CreateTask isAuth={isAuth} />} />
          <Route path="/managetask" element={<ManageTask />} />
          <Route path="/viewsubmissions" element={<ViewSubmissions />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        </Routes>
    </Router>
  );
}

export default App;
