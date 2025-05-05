
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
import Addbike from "./Owner/AddBike/Addbike.js";
import AccountLayout from "./Account/AccountLayout.js";
import RentPage from "./RentPage/RentPage.js";
import RentalForm from "./RentalForm/RentalForm.js";
import BookingPage from './Account/BookingPage/BookingPage.js'
import AccountPage from './Account/AccountPage/Account.js'
import Favorite from "./Account/Favorite/Favorite.js";
import BikeManagement from "./Account/BikeManagement/BikeManagement.js";

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
          <Route path="/motor-detail/:id" element={<MotorDetail isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
          <Route path="/owner/register" element={<Register isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
          <Route path="/owner/register-form" element={<RegisterPage isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />} />
          <Route path="/search" element={<Search />} />
          {/* <Route path="/owner/add-bike" element={<Addbike />} /> */}
          <Route path="/rent/:id" element={<RentPage />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index path="my-account" element={<AccountPage />} />
            <Route path="add-bike" element={<Addbike/>}/>
            <Route path="my-bookings" element={<BookingPage />} />
            <Route path="favorites" element={<Favorite />} />
            <Route path="bikes" element={<BikeManagement/>} />
          </Route>
          <Route path="/rental-form/:id" element={<RentalForm />} />
          <Route path="/rent-page" element={<RentPage />} />
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
