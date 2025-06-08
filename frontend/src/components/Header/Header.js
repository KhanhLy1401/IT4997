
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({user, setUser}) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  

  return (
    <div className='header'>
      <div className='left-header'>
        <div className='logo-header'>
          <img src='../../../logo.png' alt='logo' />
          <div className='title-header' onClick={()=>{navigate('/')}}>MOTORENT</div>
        </div>
        <div className='contact-header'>
          <NavLink to='/about-us' className="header-item" activeclassname="active">
            <span>Về Motorent</span>
          </NavLink>
          {
            role==="owner" ? <NavLink to="/account/my-account" className="header-item" activeclassname="active">Đăng xe </NavLink> : <NavLink to="/owner/register" className="header-item" activeclassname="active">
            <span>Trở thành chủ xe</span>
          </NavLink>
          }

           
          
          
        </div>  
      </div>
      
      <div className='right-header'>
        { user ? ( 
          <div className='user-menu'>
            <span className='user-name'> {user || ''}   <span onClick={() => {
                setUser(null);
                localStorage.removeItem("fullName");
                localStorage.removeItem("role");
                navigate("/");
              }}><i class="fa-duotone fa-solid fa-right-from-bracket"> </i>
              </span></span>
            <div className='dropdown-menu'>
              <NavLink to="/account/my-account">Hồ sơ</NavLink>
              <NavLink to="/account/my-bookings">Đơn thuê xe</NavLink>
              
            </div>
          </div>
        ) : (
          <>
            <div className='sign-up' onClick={() => navigate('/sign-in')}>
              Đăng ký
            </div>
            <div className='sign-in' onClick={() => navigate('/sign-in')}>
              Đăng nhập
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

