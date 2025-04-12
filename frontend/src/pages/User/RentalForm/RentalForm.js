import React from "react";
import "./RentalForm.css";

const RentalForm = () => {
  return (
    <div className="rental-container">
      <div className="vehicle-info">
        <h2>HONDA BLADE 2018</h2>
        <p>Xăng - 110cc - Xe số - Sản xuất 2018</p>
        <div className="rental-time">
          <p><strong>GIAO XE:</strong> Nhận xe tại đại lý</p>
          <p><strong>THỜI GIAN:</strong> 07:00 05/04/2025 → 07:00 06/04/2025</p>
        </div>
        <div className="price-details">
          <h3>CHI TIẾT GIÁ</h3>
          <p>Đơn giá: 100.000 đ</p>
          <p>Thời gian thuê: × 1,5 ngày</p>
          <p>Giá cơ bản: 150.000 đ</p>
          <p>+ Phụ phí cuối tuần: 20.000 đ</p>
          <p><strong>Tổng: 170.000 đ</strong></p>
          <p>Đặt cọc: 51.000 đ</p>
        </div>
      </div>

      <div className="customer-info">
        <h3>THÔNG TIN KHÁCH HÀNG</h3>
        <form>
          <input type="text" placeholder="Họ và tên" required />
          <input type="text" placeholder="Số điện thoại" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Ghi chú của khách hàng" />

          <div className="payment-method">
            <label><input type="radio" name="payment" /> Trả trước (giảm 5%)</label>
            <label><input type="radio" name="payment" defaultChecked /> Trả sau</label>
            <div className="sub-options">
              <label><input type="radio" name="subpayment" defaultChecked /> Thẻ ATM nội địa</label>
              <label><input type="radio" name="subpayment" /> VISA/MasterCard</label>
              <label><input type="radio" name="subpayment" /> VNPAY</label>
              <label><input type="radio" name="subpayment" /> Chuyển khoản</label>
              <label><input type="radio" name="subpayment" /> Thanh toán sau</label>
            </div>
          </div>

          <input type="text" placeholder="Mã giảm giá" className="discount-input" />

          <div className="form-buttons">
            <button type="submit" className="confirm">Hoàn tất đặt xe</button>
            <button type="button" className="cancel">Quay lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalForm;
