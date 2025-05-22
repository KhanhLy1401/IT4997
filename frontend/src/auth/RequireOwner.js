// src/components/RequireAdmin.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireOwner = ({ children }) => {
  const user = localStorage.getItem('role'); // hoặc từ context/auth
  const isOwner = user?.role === 'owner'; // tùy vào cách bạn lưu role

  if (!isOwner) {
    return <>
        <div>
            Bạn không phải chủ xe, chỉ có chủ xe có chức năng này.
            Trở thành chủ xe 
            
        </div>
        
    </>
  }

  return children; // render admin layout nếu là admin
};

export default RequireOwner;
