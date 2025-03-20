import React, { useState } from 'react'
import { BrowserRouter as  Routes, Route } from 'react-router-dom'; 
import Header from '../../components/Header/Header.js'
import Footer from '../../components/Footer/Footer.js';
import Home from './Home/Home.js'
import MotorDetail from './MotorDetail/MotorDetail.js'
import Register from './Owner/Register/Register.js';
import RegisterPage from './Owner/RegisterPage/RegisterPage.js';
import './UserLayout.css'

const UserLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
  return (
            <div className='user-layout'>
                <Header setIsOpen={setIsOpen} setIsLogin={setIsLogin} />
                <div className='main'>
                    <Routes>
                        <Route path="/" element={<Home isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
                        <Route path="/motor-detail" element={<MotorDetail />} />
                        <Route path="/owner/register" element={<Register/>}/>
                        <Route path="/owner/register-form" element={<RegisterPage/>}/>
                    </Routes>
                </div>
                <Footer/>
                <div className='zalo' >
                <a href="https://zalo.me/0946234129" target="_blank" rel="noopener noreferrer" className="zalo">
                    <img src="/assets/zalo.svg" alt="Zalo" />
                </a>
                </div>
            </div>
  )
}

export default UserLayout;