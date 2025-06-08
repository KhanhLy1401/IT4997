// src/components/RequireAdmin.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const RequireAdmin = ({ children }) => {
  const user = localStorage.getItem('token'); 
  const decoded = jwtDecode(user);
  const isAdmin = decoded?.role === 'admin'; 

  if (!isAdmin) {
    alert("Bạn không phải quản trị viên vui lòng đăng nhập dưới quyền quản trị viên ")
    console.log("Decoded token:", decoded);

    return <Navigate to="/" replace />; // chuyển hướng nếu không phải admin
  }

  return children; // render admin layout nếu là admin
};

export default RequireAdmin;
