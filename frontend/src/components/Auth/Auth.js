import React, { useState } from 'react';
import './Auth.css';

const AuthModal = ({ isOpen, setIsOpen, isLogin, setIsLogin }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      alert('Mật khẩu không khớp');
      return;
    }
    setError('');
    console.log(isLogin ? 'Đăng nhập' : 'Đăng ký', { fullName, phone, email, password });
    setIsOpen(false);
    alert(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>

        <div className="switch-auth">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Đăng nhập</button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Đăng ký</button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Họ và tên (*)" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          )}
          <input type="tel" placeholder="Số điện thoại (*)" pattern='^\d{10}$' value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <input type="email" placeholder="Email (*)" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type={showPassword ? "text" : "password"} placeholder="Mật khẩu (*)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            }}
        >
            show password
        </span>
          {!isLogin && (
            <input type="password" placeholder="Nhập lại mật khẩu (*)" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
