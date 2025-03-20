// import React, {useState} from 'react'
// import './Header.css'
// import AuthModal from '../Auth/Auth.js'

// const Header = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [isLogin, setIsLogin] = useState(false);
  
//   return (
//     <div className='header'>
//         <div className='left-header'>
//           <div className='logo-header'>
//               <img src='../../../logo.png' alt='logo' />
//               <div className='title-header'>MOTORENT</div>
//           </div>
//           <div className='contact-header'>
//               <span>Về Motorent</span>
//               <span>Trở thành chủ xe</span>
//           </div>  
//         </div>
        
//         <div className='right-header'>
//           <div className='sign-up'>
//               Đăng ký
//           </div>
//           <div className='sign-in'>
//               Đăng nhập
//           </div>
//         </div>
//     </div>
//   )
// }

// export default Header

import React from 'react';
import './Header.css';

const Header = ({ setIsOpen, setIsLogin }) => {
  return (
    <div className='header'>
      <div className='left-header'>
        <div className='logo-header'>
          <img src='../../../logo.png' alt='logo' />
          <div className='title-header'>MOTORENT</div>
        </div>
        <div className='contact-header'>
          <span>Về Motorent</span>
          <span>Trở thành chủ xe</span>
        </div>  
      </div>
      
      <div className='right-header'>
        <div 
          className='sign-up' 
          onClick={() => { setIsOpen(true); setIsLogin(false); }} // Mở modal và đặt là form Đăng ký
        >
          Đăng ký
        </div>
        <div 
          className='sign-in' 
          onClick={() => { setIsOpen(true); setIsLogin(true); }} // Mở modal và đặt là form Đăng nhập
        >
          Đăng nhập
        </div>
      </div>
    </div>
  );
};

export default Header;
