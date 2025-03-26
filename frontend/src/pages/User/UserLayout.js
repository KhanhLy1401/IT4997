// import React, { useState } from 'react'
// import {  Routes, Route } from 'react-router-dom'; 
// import Header from '../../components/Header/Header.js'
// import Footer from '../../components/Footer/Footer.js';
// import Home from './Home/Home.js'
// import MotorDetail from './MotorDetail/MotorDetail.js'
// import Register from './Owner/Register/Register.js';
// import RegisterPage from './Owner/RegisterPage/RegisterPage.js';
// import './UserLayout.css'
// import Search from './Find/Search.js';

// const UserLayout = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isLogin, setIsLogin] = useState(true);
   
//     const [user, setUser] = useState(null); 
//   return (
//             <div className='user-layout'>
//                 <Header setIsOpen={setIsOpen} setIsLogin={setIsLogin} user={user} setUser={setUser} />
//                 <div className='main'>
//                     <Routes>
//                         <Route path="/" element={<Home isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
//                         <Route path="/motor-detail" element={<MotorDetail isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin}  />} />
//                         <Route path="/owner/register" element={<Register isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin}  />}/>
//                         <Route path="/owner/register-form" element={<RegisterPage isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin}  />}/>
//                         <Route path="/search" element={<Search/>} />

//                     </Routes>
//                 </div>
//                 <Footer/>
//                 <div className='zalo' >
//                 <a href="https://zalo.me/0946234129" target="_blank" rel="noopener noreferrer" className="zalo">
//                     <img src="/assets/zalo.svg" alt="Zalo" />
//                 </a>
//                 </div>
//             </div>
//   )
// }

// export default UserLayout;

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import Home from "./Home/Home.js";
import MotorDetail from "./MotorDetail/MotorDetail.js";
import Register from "./Owner/Register/Register.js";
import RegisterPage from "./Owner/RegisterPage/RegisterPage.js";
import "./UserLayout.css";
import Search from "./Find/Search.js";
import AuthModal from "../../components/Auth/Auth.js"; // Import AuthModal

const UserLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false); // Điều khiển modal Auth
  const [user, setUser] = useState(localStorage.getItem("user") || null);

  return (
    <div className="user-layout">
      <Header
        setIsOpen={setIsOpen}
        setIsLogin={setIsLogin}
        setIsAuthOpen={setIsAuthOpen} // Truyền xuống Header
        user={user}
        setUser={setUser}
      />
      
      <AuthModal
        isOpen={isAuthOpen}
        setIsOpen={setIsAuthOpen}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        setUser={setUser} // Truyền setUser vào AuthModal
      />

      <div className="main">
        <Routes>
          <Route path="/" element={<Home isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
          <Route path="/motor-detail" element={<MotorDetail isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
          <Route path="/owner/register" element={<Register isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
          <Route path="/owner/register-form" element={<RegisterPage isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>

      <Footer />

      <div className="zalo">
        <a href="https://zalo.me/0946234129" target="_blank" rel="noopener noreferrer" className="zalo">
          <img src="/assets/zalo.svg" alt="Zalo" />
        </a>
      </div>
    </div>
  );
};

export default UserLayout;
