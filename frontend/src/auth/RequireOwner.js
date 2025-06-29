// src/components/RequireAdmin.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const RequireOwner = ({ children }) => {
  const user = localStorage.getItem('token'); 
  const decoded = jwtDecode(user);
  const isOwner = decoded?.role === 'owner' || 'admin'; 

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
