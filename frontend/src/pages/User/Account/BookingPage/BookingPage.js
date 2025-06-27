// File: BookedBikesPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingPage.css";
import axios from "axios";

const BookingPage = ({ bookings }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selectedBikeId, setSelectedBikeId] = useState(null);
  const [rating, setRating] = useState(5); // 1-5 sao
  const [comment, setComment] = useState("");
  const [recommendBikes, setRecommendBikes]= useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rentals, SetRentals] = useState(null);
  const itemsPerPage = 5;
  const API_URL = process.env.REACT_APP_API_URL;
  const API_FLASK=process.env.REACT_APP_API_FLASK;
  const userId = localStorage.getItem('_id');


  const filteredRentals = statusFilter === "Tất cả"
  ? rentals || []
  : rentals?.filter((rental) => {
      // normalize status so it matches the dropdown
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

  useEffect(() => {
        const fetchData = async () => {
            try {
                const recommendation = await axios.get(`${API_FLASK}/recommend/user?userId=${userId}`)
                setRecommendBikes(recommendation.data);                
            } catch (error) {
                console.error('Lỗi lấy chi tiets xe goi y:', error);
            }
        };

        fetchData();

    }, [API_URL]);
   
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
      console.log("rentals", response.data);
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
          <option value="Hoàn thành">Hoàn thành</option>
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
                  {/* <td>
                    {rental.startTime} {new Date(rental.startDate).toLocaleDateString('vi-VN')} - 
                    {rental.endTime} {new Date(rental.endDate).toLocaleDateString('vi-VN')}
                  </td> */}
                  <td className="rental-time">
                    <div>
                      <strong>Bắt đầu:</strong> {rental.startTime}, {new Date(rental.startDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div>
                      <strong>Kết thúc:</strong> {rental.endTime}, {new Date(rental.endDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="price">{rental.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                  <td className="status-rental">
                    <span className={`status ${rental.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {rental.status === "confirmed"
                        ? "Đã xác nhận"
                        : rental.status === "completed"
                        ? "Hoàn thành"
                        : rental.status === "pending"
                        ? "Đã hủy"
                        : rental.status}
                    </span>
                  </td>
                  <td>
                     
                      <button
                        className="action-button"
                        onClick={() => navigate(`/account/my-bookings/${rental._id}`, { state: { rental } })}
                      >
                        Xem chi tiết
                      </button>

                    
                    {rental.status === "completed" ? (
                      <button className="review-btn" onClick={() => setSelectedBikeId(rental.bikeId)}>Đánh giá</button>
                    ):""}
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
          Trước
        </button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Tiếp
        </button>
      </div>

      {recommendBikes?<>
      <div className='motor-detail-feature-title-2'>Xe tương tự cho bạn</div>
                    <div className="motor-2" >
                        {recommendBikes?.map((bike) => (
                        <div key={bike._id} onClick={() => navigate(`/motor-detail/${bike._id}`)} className="motor-img">
                            <div className='img-container'><img
                            src={bike.images?.front?.url || "/assets/anhxemay.jpg"}
                            alt={bike.title}
                            /></div>
                            <div>
                            <div className="motor-name">{bike.title}</div>
                            <div className="motor-feature">
                                <div className='motor-feature-item'>
                                <div className="motor-capacity"><i class="fa-regular fa-globe"></i> Dung tích: {bike?.capacity } cm<sup>3</sup></div>
                                <div className='motor-fuel'><i className="fa-solid fa-gas-pump"></i> Xăng </div>
                                </div>
                                <div className="motor-type"><i class="fa-regular fa-motorcycle"></i> Loại xe: {bike.bikeType || "Xe số"}</div>
                                <div className="motor-brand"><i className="fa-regular fa-tags" ></i> Hãng: {bike.brand}</div>
                            
                            </div>
                            <div className='line-motor'></div>
                            <div className="motor-address">
                                <i class="fa-solid fa-location-dot location-dot"></i> {bike.location?.province || "Hanoi"}
                            </div>
                            <div className="motor-rating">
                                <div>4.5 <i className="fa-solid fa-star yellow-star"></i> - <i className="fa-regular fa-suitcase-rolling luggage"  ></i> {bike.rental_count} chuyến</div>
                                <div className='motor-price'> <span>{bike.price/1000  || 0}K</span>/ngày </div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </>:<></>}
      
    </div>
  );
};
export default BookingPage; 
