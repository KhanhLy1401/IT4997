import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faStar } from "@fortawesome/free-solid-svg-icons";
import './MotorDetail.css'
import AuthModal from '../../../components/Auth/Auth.js';


const MotorDetail = ({ isOpen, setIsOpen, isLogin, setIsLogin }) => {
    console.log(isOpen, setIsOpen, isLogin, setIsLogin);

  return (
    <div className='motor-detail'>

        <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />
        <div className='motor-detail-imgs'>
            <div className='md-main-img'>
                <img src='/assets/anhxemayphu.jpg' alt='' />
            </div>
            <div className='md-sub-img'>
                <img src='/assets/anhxemayphu.jpg' alt='' />
                <img src='/assets/anhxemayphu.jpg' alt='' />
                <img src='/assets/anhxemayphu.jpg' alt='' />
            </div>
        </div>
        <div className='motor-detail-main'>
            <div className='motor-detail-des'>
                <div className='motor-detail-name'>Wave alpha 2020</div>
                <div className='motor-detail-feature-1'>
                    <div className='motor-detail-rating'>3 <FontAwesomeIcon icon={faStar} /> - 1 chuyến đi - Bình Thanh, TP. Hồ Chí Minh</div>
                    <div className='motor-detail-highlight'> Xe số - Giao xe tận nơi - Đặt xe nhanh</div>
                </div>
                <div className='motor-detail-feature-2'>
                    <div className='motor-detail-feature-title'>Đặc điểm</div>
                    <div className='motor-detail-feature-2-brand'>Hãng Honda- Xe số - dung tích 119cc  </div>
                </div>
                <div className='motor-detail-feature-3'>
                    <div className='motor-detail-feature-title'>Mô tả</div>
                    <div className='motor-detail-feature-3-desc'>Toyota Rush 2020 cho số tự động,  xe gia đình, đầy đủ các cảm biến</div>
                </div>
                <div className='motor-detail-licenses'>
                    <div className='motor-detail-feature-title'>Giấy tờ thuê xe</div>
                    <div className='motor-detail-license'>
                        GPLX(đối chiếu) & CCCD(đối chiếu VNeID)
                        GPLX(đối chiếu) & Passport(giữ lại)
                    </div>

                </div>
                <div className='motor-detail-terms'>
                    <div className='motor-detail-feature-title'>Điều khoản thuê xe</div>

                </div>
                <div className='motor-detail-policy'>
                    <div className='motor-detail-feature-title'>Chính sách hủy xe</div>

                </div>
            </div>
            <div className='motor-detail-booking'>
                <div className='motor-detail-booking-1'>Bảo hiểm thuê xe

Chuyến đi có mua bảo hiểm. Khách thuê bồi thường tối đa 2.000.000 VNĐ trong trường hợp có sự cố ngoài ý muốn.

Xem thêm        </div>
                <div className='motor-detail-booking-2'>
                    <div className='motor-detail-booking-prices'>180k/ngày</div>
                    <div className='motor-detail-booking-from-to'>
                        <div className='motor-detail-booking-from'>
                            <label>Nhận xe</label>
                            <div className='wrap-date-time'>
                                <div className='wrap-date'>25/02/2025</div>
                                <div className='wrap-time'>9:00</div>
                            </div>
                        </div>
                        <div className='motor-detail-booking-to'>
                            <label>Trả xe</label>
                            <div className='wrap-date-time'>
                                <div className='wrap-date'>25/02/2025</div>
                                <div className='wrap-time'>9:00</div>
                            </div>
                        </div>
                    </div>
                    <div className='motor-detail-booking-address'>
                        <lable>Địa điểm giao nhận xe</lable>
                        <div className='wrap-address'>Thành phố Hồ Chí Minh</div>
                    </div>
                    <div className='motor-detail-booking-price-duration'>
                        <div className='motor-detail-booking-price'>Đơn giá: 180.000/ngày</div>
                        <div className='motor-detail-booking-duration'>Số ngày thuê: 3 ngày</div>

                    </div>
                    <div className='motor-detail-booking-total'>
                        Tổng cộng: 10000000đ
                    </div>
                    <div className='motor-detail-booking-btn'>
                        Chọn thuê
                    </div>

                    
                </div>
                <div className='extra-charge'>
                    Phụ phí
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default MotorDetail