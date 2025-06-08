import React from 'react';
import { useLocation } from 'react-router-dom';
import './RentalDetail.css';

const RentalDetail = () => {
  const location = useLocation();
  const rental = location.state?.rental;
  console.log("rental", rental);
  return (
    <div className="rental-detail">
      <h1 className="rental-title">Chi tiết Đơn Thuê Xe</h1>
      <p className="rental-id">Mã đơn thuê: {rental._id}</p>

      <div className="rental-section">
        <h2>🚲 Thông tin xe</h2>
        <p><strong>ID xe:</strong> {rental.bikeId}</p>
        <img
          src={rental.bikeImage}
          alt="Bike"
          className="rental-bike-image"
        />
      </div>

      <div className="rental-section">
        <h2>📅 Thời gian thuê</h2>
        <p><strong>Ngày bắt đầu:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
        <p><strong>Giờ bắt đầu:</strong> {rental.startTime}</p>
        <p><strong>Ngày kết thúc:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
        <p><strong>Giờ kết thúc:</strong> {rental.endTime}</p>
      </div>

      <div className="rental-section">
        <h2>💰 Thanh toán</h2>
        <p><strong>Tổng tiền:</strong> {rental.totalPrice.toLocaleString()} VND</p>
        <p><strong>Trạng thái thanh toán:</strong> {rental.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
      </div>

      <div className="rental-section">
        <h2>👥 Thông tin người dùng</h2>
        <p><strong>ID người thuê:</strong> {rental.userId}</p>
        <p><strong>ID chủ xe:</strong> {rental.ownerId}</p>
      </div>

      <div className="rental-section">
        <h2>🚦 Trạng thái đơn</h2>
        <p><strong>Trạng thái:</strong> {rental.status === 'confirmed' ? 'Đã xác nhận' : rental.status}</p>
        <p><strong>Ngày tạo đơn:</strong> {new Date(rental.createdAt).toLocaleString()}</p>
      </div>

      <div className="rental-note">
        <p>🗒️ Vui lòng đến đúng giờ đã đặt để nhận xe. Mang theo giấy tờ tùy thân để đối chiếu khi nhận xe.</p>
      </div>
    </div>
  );
};

export default RentalDetail;
