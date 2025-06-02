
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
import Addbike from "./Owner/AddBike/Addbike.js";
import AccountLayout from "./Account/AccountLayout.js";
import RentalForm from "./RentalForm/RentalForm.js";
import BookingPage from './Account/BookingPage/BookingPage.js'
import AccountPage from './Account/AccountPage/Account.js'
import Favorite from "./Account/Favorite/Favorite.js";
import BikeManagement from "./Account/BikeManagement/BikeManagement.js";
import Dashboard from "./Account/Dashboard/Dashboard.js";
import Auth from "../../components/Auth/SignIn.js";
import RequireOwner from "../../auth/RequireOwner.js";

const UserLayout = () => {

  const [user, setUser] = useState(localStorage.getItem("user") || null);

  return (
    <div className="user-layout">
      <Header
        user={user}
        setUser={setUser}
      />
    

      <div className="main">

        <Routes>
          <Route path="/sign-in" element={<Auth setUser={setUser}/>} />

          <Route path="/" element={<Home />} />

          <Route path="/motor-detail/:id" element={<MotorDetail  />} />
          <Route path="/owner/register" element={<Register />} />
          <Route path="/owner/register-form" element={<RegisterPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/owner/add-bike" element={<Addbike />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index path="my-account" element={<AccountPage />} />
            <Route path="add-bike" element={<RequireOwner><Addbike/></RequireOwner>}/>
            <Route path="dashboard" element={<RequireOwner><Dashboard/></RequireOwner>}/>
            <Route path="my-bookings" element={<BookingPage />} />
            <Route path="favorites" element={<Favorite />} />
            <Route path="bikes" element={<RequireOwner><BikeManagement/></RequireOwner>} />
          </Route>
          <Route path="/rental-form/:id" element={<RentalForm />} />
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
