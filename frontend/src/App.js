import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminLayout from './pages/Admin/AdminLayout.js';
import UserLayout from './pages/User/UserLayout.js';

function App() {
  return (
    <Router> {/* Bọc trong <Router> */}
      <div className="App">
        <div className="main-content">
          <Routes>
            <Route path="/*" element={<UserLayout />} />
            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
