import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
import './RentalManagement.css';

const RentalManagement = () => {
  const [rentals, setRentals] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all'); 
  const rentalsPerPage = 5;

  const fetchRentals = async () => {
    try {
      const response = await axios.get(`${API_URL}/rental/`);
      setRentals(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn thuê:", error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const filteredRentals = rentals.filter((rental) => {
    const matchSearch = 
      (rental._id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (rental.bikeId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (rental.ownerId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (rental.userId?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchStatus = selectedStatus === 'all' ? true : rental.status === selectedStatus;

    return matchSearch && matchStatus;
  });

  const indexOfLastRental = currentPage * rentalsPerPage;
  const indexOfFirstRental = indexOfLastRental - rentalsPerPage;
  const currentRentals = filteredRentals.slice(indexOfFirstRental, indexOfLastRental);

  const totalPages = Math.ceil(filteredRentals.length / rentalsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="rental-management">
      <div className="rental-management-title">
        <h2>Quản lý đơn thuê</h2>

        <div className="rental-management-search">
          <input
            type="text"
            className="search-box"
            placeholder="Tìm kiếm theo mã đơn, xe, userId..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      {/* Tabs lọc trạng thái đơn */}
      <div className="status-tabs">
        <button 
          className={selectedStatus === 'all' ? 'active' : ''}
          onClick={() => { setSelectedStatus('all'); setCurrentPage(1); }}>
          Tất cả
        </button>
        <button 
          className={selectedStatus === 'pending' ? 'active' : ''}
          onClick={() => { setSelectedStatus('pending'); setCurrentPage(1); }}>
          Đang chờ
        </button>
        <button 
          className={selectedStatus === 'confirmed' ? 'active' : ''}
          onClick={() => { setSelectedStatus('confirmed'); setCurrentPage(1); }}>
          Đã xác nhận
        </button>
        <button 
          className={selectedStatus === 'completed' ? 'active' : ''}
          onClick={() => { setSelectedStatus('completed'); setCurrentPage(1); }}>
          Hoàn tất
        </button>
        <button 
          className={selectedStatus === 'cancelled' ? 'active' : ''}
          onClick={() => { setSelectedStatus('cancelled'); setCurrentPage(1); }}>
          Đã hủy
        </button>
      </div>

      <table className="rental-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã đơn</th>
            <th>Xe</th>
            <th>Người thuê</th>
            <th>Thời gian thuê</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {currentRentals.map((rental, index) => (
            <tr key={rental._id}>
              <td>{indexOfFirstRental + index + 1}</td>
              <td>{rental._id}</td>
              <td>
                <img src={rental.bikeImage} alt="Bike" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                <div>ID xe: {rental.bikeId}</div>
              </td>
              <td>
                <div>User: {rental.userId}</div>
                <div>Owner: {rental.ownerId}</div>
              </td>
              <td>
                {moment(rental.startDate).format("DD/MM/YYYY")} {rental.startTime} → {moment(rental.endDate).format("DD/MM/YYYY")} {rental.endTime}
              </td>
              <td>{rental.totalPrice.toLocaleString()} đ</td>
              <td>{rental.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
              <td>{rental.status === 'pending' ? 'Đang chờ' : 
                   rental.status === 'confirmed' ? 'Đã xác nhận' : 
                   rental.status === 'completed' ? 'Hoàn tất' : 'Đã hủy'}</td>
              <td>{moment(rental.createdAt).format("HH:mm:ss DD/MM/YYYY")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>❮</button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => goToPage(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>❯</button>
      </div>
    </div>
  );
};

export default RentalManagement;
