import React, { useState } from "react";
import "./RentPage.css";

const RentPage = () => {
  const [delivery, setDelivery] = useState(true);

  return (
    <div className="rent-car-container">
      {/* Phần bên trái: Thông tin xe */}
      <div className="car-info">
        <img
          src="https://via.placeholder.com/150"
          alt="Honda Future"
          className="car-image"
        />
        <h2>HONDA FUTURE 50CC 2011</h2>
        <p className="rating">⭐⭐⭐⭐☆</p>
        <ul>
          <li>⛽ Xăng</li>
          <li>🏍️ 50 cc</li>
          <li>⚙️ Xe số</li>
          <li>📅 Sản xuất 2011</li>
        </ul>
        <h3>ĐỊA CHỈ</h3>
        <p>Quận Gò Vấp, Tp. Hồ Chí Minh</p>

        <h3>THỦ TỤC</h3>
        <p><strong>Giấy tờ chỉ cần xác minh:</strong></p>
        <ul>
          <li>CMND</li>
          <li>Bằng lái</li>
        </ul>
        <p><strong>Tài sản thế chấp:</strong></p>
        <ul>
          <li>Đặt cọc 20 triệu đồng trở lên</li>
        </ul>
      </div>

      {/* Phần bên phải: Các tùy chọn thuê xe */}
      <div className="rental-options">
        <div className="section">
          <h3>🚗 GIAO XE</h3>
          <label>
            <input
              type="checkbox"
              checked={delivery}
              onChange={() => setDelivery(!delivery)}
            />
            Giao xe tại nhà
          </label>
          {delivery && (
            <div className="delivery-info">
              <input type="text" placeholder="Nhập địa chỉ nhận xe" />
              <p>
                Phí giao xe: <br />
                - Dưới 5km: 50.000đ <br />
                - Trên 5km: 10.000đ/km
              </p>
            </div>
          )}
        </div>

        <div className="section">
          <h3>⏳ THỜI GIAN THUÊ</h3>
          <input type="datetime-local" />
          <input type="datetime-local" />
        </div>

        <div className="section">
          <h3>💰 CHI TIẾT GIÁ</h3>
          <p>Đơn giá: <strong>80.000đ</strong></p>
          <p>Thời gian thuê: <strong>1 ngày</strong></p>
          <p>Giá cơ bản: <strong>80.000đ</strong></p>
        </div>

        <button className="rent-button">Thuê ngay</button>
      </div>
    </div>
  );
};

export default RentPage;
