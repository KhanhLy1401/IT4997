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
            <NavLink to="/account/my-account"><i className="fa-light fa-user"></i> Tài khoản của tôi</NavLink>
          </li>
          <li>
            
            <NavLink to ="/account/favorites"><i className="fa-regular fa-heart"></i> Xe yêu thích</NavLink>
          </li>
          <li>
            
            <NavLink to='/account/add-bike'><i className="fa-solid fa-arrow-up-from-bracket"></i> Đăng xe</NavLink>
          </li>
          <li>
            
            <NavLink to='/account/bikes'><i className="fa-regular fa-motorcycle"></i> Xe của tôi</NavLink>
          </li>
          <li>
          <NavLink to='/account/dashboard'><i class="fa-solid fa-chart-mixed-up-circle-dollar"></i> Thống kê </NavLink>

          </li>
          <li>
            
            <NavLink to="/account/my-bookings"><i className="fa-regular fa-box-check"></i> Chuyến của tôi</NavLink>
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
