
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = ({ setIsOpen, setIsLogin, setIsAuthOpen, user, setUser }) => {
  const role = localStorage.getItem("role");
  return (
    <div className='header'>
      <div className='left-header'>
        <div className='logo-header'>
          <img src='../../../logo.png' alt='logo' />
          <div className='title-header'>MOTORENT</div>
        </div>
        <div className='contact-header'>
          <NavLink to='/about-us' className="header-item" activeclassname="active">
            <span>Về Motorent</span>
          </NavLink>
          {
            role==="owner" ? <NavLink to="/owner/add-bike">Đăng xe </NavLink> : <NavLink to="/owner/register" className="header-item" activeclassname="active">
            <span>Trở thành chủ xe</span>
          </NavLink>
          }
          
          
        </div>  
      </div>
      
      <div className='right-header'>
        {user ? ( 
          <div className='user-menu'>
            <span className='user-name'>👤 {user}</span>
            <div className='dropdown-menu'>
              <NavLink to="/profile">Hồ sơ</NavLink>
              <NavLink to="/my-bookings">Đơn thuê xe</NavLink>
              <div className='logout' onClick={() => {
                setUser(null);
                localStorage.removeItem("user");
              }}><i class="fa-duotone fa-solid fa-right-from-bracket"></i></div>
            </div>
          </div>
        ) : (
          <>
            <div 
              className='sign-up' 
              onClick={() => { setIsAuthOpen(true); setIsLogin(false); }} 
            >
              Đăng ký
            </div>
            <div 
              className='sign-in' 
              onClick={() => { setIsAuthOpen(true); setIsLogin(true); }} 
            >
              Đăng nhập
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

