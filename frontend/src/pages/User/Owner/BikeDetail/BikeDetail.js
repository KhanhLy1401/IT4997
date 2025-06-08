import React from 'react';
import { useLocation } from 'react-router-dom';
import './BikeDetail.css'

const BikeDetail = () => {
  const location = useLocation();
  const bike = location.state?.bike;
  console.log("bike", bike);

  if (!bike) return <div>Đang tải thông tin xe...</div>;

  return (
    <div className="bike-detail">
      <h1>{bike.title}</h1>
      <h3>{bike.brand} - {bike.bikeType} - {bike.capacity}cc</h3>

      <div className="bike-images">
        <img src={bike.images.front.url} alt="Mặt trước xe" />
        <img src={bike.images.side.url} alt="Mặt bên xe" />
        <img src={bike.images.back.url} alt="Mặt sau xe" />
      </div>

      <p><strong>Biển số:</strong> {bike.license_plate}</p>
      <p><strong>Chủ xe:</strong> {bike.ownerName}</p>

      <div className="bike-location">
        <h4>Địa điểm: {bike.location.detail_location}, {bike.location.ward}, {bike.location.district}, {bike.location.province}</h4>
        <p>
          
        </p>
      </div>

      <p><strong>Giao tận nhà:</strong> {bike.delivery_home ? "Có" : "Không"}</p>
      <p><strong>Tiền cọc:</strong> {bike.security_deposit}</p>
      <p><strong>Loại cho thuê:</strong> {bike.rental_type}</p>
      <p><strong>Trạng thái:</strong> {bike.status}</p>

      <div className="bike-prices">
        <h4>Giá thuê:</h4>
        <p>Ngày: {bike.price.perDay} VND</p>
        <p>Tuần: {bike.price.perWeek} VND</p>
        <p>Tháng: {bike.price.perMonth} VND</p>
      </div>

      <div className="bike-documents">
        <h4>Giấy tờ xe:</h4>
        <p>Đăng ký xe:</p>
        <img src={bike.bike_registration.url} alt="Đăng ký xe" />
        <p>Bảo hiểm xe:</p>
        <img src={bike.bike_insurance.url} alt="Bảo hiểm xe" />
      </div>

      <div className="bike-description">
        <h4>Mô tả:</h4>
        <p>{bike.description}</p>
      </div>
    </div>
  );
};

export default BikeDetail;
