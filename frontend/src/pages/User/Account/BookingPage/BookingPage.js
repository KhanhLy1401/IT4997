// File: BookedBikesPage.jsx

import React, { useEffect, useState } from "react";
import "./BookingPage.css";
import axios from "axios";

const BookingPage = ({ bookings }) => {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [rentals, SetRentals] = useState(null);
  const itemsPerPage = 5;
  const API_URL = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem('_id');

  const filteredBookings = statusFilter === "Tất cả"
    ? bookings
    : bookings?.filter((booking) => booking.status === statusFilter);

  const totalPages = Math.ceil(filteredBookings?.length / itemsPerPage );
  const currentBookings = filteredBookings?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
   
  const getRentalByUser = async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/rental/user/${userId}`);
      SetRentals(response.data);
    } catch(error) {
      console.log("error in getRentalByUser", error.message);
    }
  }

  useEffect(()=>{
    getRentalByUser();
  }, [API_URL]);

  return (
    <div className="table-container">
      <h2 className="title">Danh sách xe đã đặt</h2>

      <div className="filter-bar">
        <label>Lọc theo trạng thái: </label>
        <select value={statusFilter} onChange={handleFilterChange}>
          <option value="Tất cả">Tất cả</option>
          <option value="Đã thanh toán">Đã thanh toán</option>
          <option value="Đang thuê">Đang thuê</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="rental-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên xe</th>
              <th>Chủ xe</th>
              <th>Thời gian thuê</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rentals?.map((rental, index) => (
              <tr key={index}>
                <td>
                  <img src={rental.bikeImage} alt={rental.bikeName} className="bike-image" />
                </td>
                <td>{rental.bikeName}</td>
                <td>{rental.ownerName}</td>
                <td>
                  {rental.startDate} - {rental.endDate}
                </td>
                <td className="price">{rental.totalPrice}₫</td>
                <td>
                  <span className={`status ${rental.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {rental.status}
                  </span>
                </td>
                <td>
                  <button className="action-button">Xem chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          ◀
        </button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          ▶
        </button>
      </div>
    </div>
  );
};
export default BookingPage; 
