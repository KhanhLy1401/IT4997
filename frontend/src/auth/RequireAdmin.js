// src/components/RequireAdmin.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const user = localStorage.getItem('role'); // hoặc từ context/auth
  const isAdmin = user?.role === 'admin'; // tùy vào cách bạn lưu role

  if (!isAdmin) {
    alert("Bạn không phải quản trị viên vui lòng đăng nhập dưới quyền quản trị viên ")
    return <Navigate to="/" replace />; // chuyển hướng nếu không phải admin
  }

  return children; // render admin layout nếu là admin
};

export default RequireAdmin;
