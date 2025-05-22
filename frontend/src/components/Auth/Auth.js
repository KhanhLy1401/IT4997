
import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './Auth.css';

const AuthModal = ({ isOpen, setIsOpen, isLogin, setIsLogin, setUser }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${API_URL}/auth/sign-in`, { email, password });
       
        
        const userData = response.data.token;
        
        if (userData) {

          const decoded = jwtDecode(userData);
          console.log("Decoded token:", decoded);

          localStorage.setItem("user", decoded.email);
          localStorage.setItem("_id", decoded._id);
          localStorage.setItem("phone", decoded.phone);
          localStorage.setItem("fullName", decoded.fullName);
          localStorage.setItem("role", decoded.role)

          setUser(decoded.email);
        alert("Đăng nhập thành công!");

        }
      } else {
        response = await axios.post(`${API_URL}/auth/sign-up`, {
          fullName,
          phone,
          email,
          password,
        });

        alert("Đăng ký thành công!");
      }

      setIsOpen(false);
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        <h1>{isLogin ? "Đăng nhập" : "Đăng ký"}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Họ và Tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
        </form>
        <p className="switch-mode">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Đăng ký" : "Đăng nhập"} 
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
