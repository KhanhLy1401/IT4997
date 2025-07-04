// File: BookedBikesPage.jsx

import React, { useEffect, useState } from "react";
import "./BookingPage.css";
import axios from "axios";

const BookingPage = () => {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selectedBikeId, setSelectedBikeId] = useState(null);
  const [rating, setRating] = useState(5); 
  const [comment, setComment] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rentals, SetRentals] = useState(null);
  const itemsPerPage = 10;
  const API_URL = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem('_id');


  const filteredRentals = statusFilter === "Tất cả"
  ? rentals || []
  : rentals?.filter((rental) => {
          const displayStatus =
            rental.status === "completed"
              ? "Hoàn thành"
              : rental.status === "confirmed"
              ? "Đang thuê"
              : rental.status === "pending"
              ? "Đã hủy"
              : rental.status;

          return displayStatus === statusFilter;
        });

    const totalPages = Math.ceil(filteredRentals.length / itemsPerPage) || 1;

    const currentRentals = filteredRentals.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );


  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
   
  const handleSubmitReview = async (bikeId) => {
    try {
      await axios.post(`${API_URL}/review/add`, {
        bikeId,
        userId,
        rating,
        comment,
      });
      alert("Gửi đánh giá thành công!");
      setSelectedBikeId(null); // ẩn form
    } catch (error) {
      console.error("Gửi đánh giá thất bại:", error.message);
    }
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
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      <div className="bike-table">
        <table className="rental-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Thời gian thuê</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
            <tbody>
            {currentRentals?.map((rental, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td><img src={rental.bikeImage} alt={rental.bikeName} className="bike-image" /></td>

                  <td className="rental-time">
                    <div>
                      <strong>Bắt đầu:</strong> {rental.startTime}, {new Date(rental.startDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div>
                      <strong>Kết thúc:</strong> {rental.endTime}, {new Date(rental.endDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="price">{rental.totalPrice.toLocaleDateString()} VNĐ</td>
                  <td>
                    <span className={`status ${rental.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {rental.status === "confirmed" ? "Đã xác nhận" : (rental.status==="completed"?"Hoàn thành": rental.status)}
                    </span>
                  </td>
                  <td>
                    {rental.status === "completed" ? (
                      <button onClick={() => setSelectedBikeId(rental.bikeId)}>Đánh giá</button>
                    ) : (
                      <button className="action-button">Xem chi tiết</button>
                    )}
                  </td>
                </tr>

                {selectedBikeId === rental.bikeId && (
                  <tr>
                    <td colSpan="7">
                      <div className="review-box">
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              style={{
                                fontSize: "20px",
                                cursor: "pointer",
                                color: star <= rating ? "#ffc107" : "#e4e5e9",
                              }}
                              onClick={() => setRating(star)}
                            >
                              <i className="fa-solid fa-star"></i>
                            </span>
                          ))}
                        </div>
                        <textarea
                          rows="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Nhập nhận xét của bạn..."
                          style={{ width: "100%", marginTop: "10px" }}
                        ></textarea>
                        <div style={{ marginTop: "10px" }}>
                          <button onClick={() => handleSubmitReview(rental.bikeId)}>Gửi đánh giá</button>
                          <button onClick={() => setSelectedBikeId(null)} style={{ marginLeft: "10px" }}>Hủy</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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
