import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './SignIn.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError('');
    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${API_URL}/auth/sign-in`, { email, password });
        const userData = response.data.token;
        localStorage.setItem('token',userData);
        if (userData) {
          const decoded = jwtDecode(userData);
          
          console.log("decoded",decoded);
          localStorage.setItem("user", decoded.email);
          localStorage.setItem("_id", decoded._id);
          localStorage.setItem("role", decoded.role);
          localStorage.setItem("phone", decoded.phone);
          localStorage.setItem("fullName", decoded.fullName);
          alert("Đăng nhập thành công!");
          navigate("/");
        }
      } else {
        await axios.post(`${API_URL}/auth/sign-up`, { fullName, phone, email, password });
        alert("Đăng ký thành công!");
        setIsLogin(true); // chuyển về trang đăng nhập sau khi đăng ký
      }
    } catch (err) {
      console.log(err.message);
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="fancy-container">
      <div className="fancy-box">
        <div className="left-panel">
          <h2>Bạn chưa có tài khoản ?</h2>
          <p>Đăng ký ngay để trải nghiệm dịch vụ của chúng tôi</p>
          <button onClick={() => setIsLogin(false)}>Đăng ký</button>
        </div>
        <div className="right-panel">
          <form onSubmit={handleSubmit}>
            <h2>{isLogin ? 'Sign in' : 'Sign up'}</h2>

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">{isLogin ? 'Đăng nhập' : 'Đăng ký '}</button>
          </form>

          <div className="social-login">
            <p className="switch-text">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
              <span className='login-btn' onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? " Đăng ký" : " Đăng nhập"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
