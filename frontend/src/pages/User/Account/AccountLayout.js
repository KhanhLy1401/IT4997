import React from "react";
import { NavLink, Routes, Route, Outlet } from "react-router-dom";
import "./AccountLayout.css";

const AccountLayout = () => {
  return (
    <div className="account-container">
      <aside className="sidebar-account">
        <h2>Xin chào bạn!</h2>
        <ul>
          <li>
            <i className="fa-light fa-user"></i>
            <NavLink to="/account">Tài khoản của tôi</NavLink>
          </li>
          <li>
            <i className="fa-regular fa-heart"></i> 
            <NavLink to ="/account/favorites">Xe yêu thích</NavLink>
          </li>
          <li>
            <i className="fa-regular fa-motorcycle"></i> 
            <NavLink to='/account/bikes'>Xe của tôi</NavLink>
          </li>
          <li>
            <i className="fa-regular fa-box-check"></i>
            <NavLink to="/account/my-bookings">Chuyến của tôi</NavLink>
          </li>
          <li><i className="fa-regular fa-map-pin"></i> Địa chỉ của tôi</li>
          <li className="logoutt"><i className="fa-solid fa-left-from-bracket"></i> Đăng xuất</li>
        </ul>
      </aside>

      <main className="account-content">
          <Outlet/>
      </main>
    </div>
  );
};

export default AccountLayout;
