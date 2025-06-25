
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./RentalForm.css";

const RentalForm = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { state } = useLocation();
  const email = localStorage.getItem('user');
  const fullName = localStorage.getItem('fullName');
  const phone = localStorage.getItem('phone');
  const [paymentMethod, setPaymentMethod] = useState('before'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem('_id');
  console.log("State", state);



  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!state || isSubmitting) return;
    setIsSubmitting(true);
  
    // 1. Dữ liệu đơn thuê
    const rentalData = {
      ownerId: state.bikeOwnerId, 
      userId,
      bikeId: state.bikeId,
      bikeImage: state.bikeImage,
      startDate: state.startDate,
      startTime: state.startTime,
      endTime: state.endTime,
      endDate: state.endDate,
      totalPrice: state.totalPrice,
      paymentStatus: paymentMethod === 'before' ? 'pending' : 'unpaid',
      status: 'pending'
    };
    console.log("rentaldata", rentalData)
  
    try {
      // 2. Tạo đơn thuê (POST /rental/create)
      const rentalRes = await axios.post(`${API_URL}/rental/add`, rentalData);
      console.log("rentalData",rentalData);
      const rental = rentalRes.data.newRental;
      const rentalId = rental._id;
  
      console.log("Rental created:", rental);
  
      // Nếu người dùng chọn "trả trước", tạo thanh toán MoMo
      if (paymentMethod === 'before') {
        const paymentPayload = {
          rentalId: rentalId,
          orderId: `ORDER_${Date.now()}`, // Mã đơn hàng duy nhất
          amount: rental.totalPrice,
          orderInfo: `Thanh toán đơn thuê xe ${rentalId}`,
        };
        console.log("payment payload", paymentPayload);
  
        const paymentRes = await axios.post(`${API_URL}/payment/create`, paymentPayload);
        const { payUrl } = paymentRes.data;
  
        // 3. Chuyển hướng đến MoMo
        if (payUrl) {
          window.location.href = payUrl;
        }
      } else {
        // Trả sau → chỉ cần thông báo thành công
        alert("Đã tạo đơn thuê, thanh toán sẽ được thực hiện sau.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error.message);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
    setIsSubmitting(false);
  };

  
  return (
    <div className="rental-container">
      <div className="vehicle-info">
        <div className="info-details">
          <h2>{state?.bikeTitle}</h2>
          <img src={state?.bikeImage} alt={state?.bikeTitle} />
          <p>Xăng - {state?.bikeCapacity || "110"} - Xe số - Sản xuất 2018</p>
          <div className="rental-time">
            <p><strong>THỜI GIAN:</strong> {state.startDate} - {state.startTime}→ {state.endDate}-{state.endTime}</p>
          </div>
        </div>

        <div className="price-details">
          <h3>CHI TIẾT GIÁ</h3>
          <p>Đơn giá: {state.bikePrice} đ</p>
          <p>Thời gian thuê: × {state.rentalDuration.toFixed(2)} ngày</p>
          <p><strong>Tổng: {state.totalPrice.toFixed(2)} đ</strong></p>
          {/* <p>Đặt cọc: {(state.totalPrice * 0.3).toFixed(2)} đ</p> */}
        </div>
      </div>

      <div className="customer-info">
        <h3>THÔNG TIN KHÁCH HÀNG</h3>
        <form onSubmit={handlePaymentSubmit}>
          <div>
            <div className="customer-name">Khách hàng: {fullName}</div>
            <div className="customer-email">Email: {email}</div>
            <div className="customer-phone">Số điện thoại: {phone}</div>
          </div>

          <div className="payment-method">
            <div className="option">
              <label>
                <input 
                  type="radio" 
                  name="payment" 
                  value="before" 
                  onChange={() => setPaymentMethod('before')} 
                />
                <span>Thanh toán</span>
              </label>
            </div>
            {/* <div className="option">
              <label>
                <input 
                  type="radio" 
                  name="payment" 
                  value="after" 
                  onChange={() => setPaymentMethod('after')} 
                  defaultChecked 
                />
                <span>Trả sau</span>
              </label>
            </div> */}
          </div>

          <div className="form-buttons">
          <button type="submit" className="confirm" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Thanh toán'}
          </button>
            <button type="button" className="cancel">Quay lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalForm;
