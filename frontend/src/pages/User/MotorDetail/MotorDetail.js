import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faStar } from "@fortawesome/free-solid-svg-icons";
import './MotorDetail.css'
import AuthModal from '../../../components/Auth/Auth.js';
import { useParams } from "react-router-dom";
import axios from 'axios';



const MotorDetail = ({ isOpen, setIsOpen, isLogin, setIsLogin}) => {
    const { id } = useParams(); // Lấy id từ URL
    const [bike, setBike] = useState();
    const API_URL = process.env.REACT_APP_API_URL;
    const [pickupDateTime, setPickupDateTime] = useState('2025-02-25T09:00')
    const [returnDateTime, setReturnDateTime] = useState('2025-02-25T09:00')
    const [rentalDuration, setRentalDuration] = useState(0) // đơn vị ngày (thập phân)
    const [totalPrice, setTotalPrice] = useState(0)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/bike/${id}`);
                setBike(response.data);
                console.log(bike)
            } catch (error) {
                console.error('Lỗi lấy chi tiets xe:', error.message);
            }
        };

        fetchData();
    }, [API_URL]);

    useEffect(() => {
        if (!bike || !bike.price) return;
      
        const pickup = new Date(pickupDateTime);
        const dropoff = new Date(returnDateTime);
      
        const diffInMs = dropoff - pickup;
        const diffInHours = diffInMs / (1000 * 60 * 60);
      
        if (diffInHours > 0) {
          const days = diffInHours / 24;
          setRentalDuration(days);
      
          const pricePerDay = bike.price.perDay || 0;
          const price = pricePerDay * days;
          setTotalPrice(price);
        } else {
          setRentalDuration(0);
          setTotalPrice(0);
        }
      }, [pickupDateTime, returnDateTime, bike]); // ✅ sửa lại dependency, chỉ cần theo dõi `bike`
      
  if (!bike) {
    return <div>Không tìm thấy xe</div>;
  }

  return (
    <div className='motor-detail'>

        <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />
        <div className='motor-detail-imgs'>
            <div className='md-main-img'>
                <img src={bike.images[0]} alt='' />
            </div>
            <div className='md-sub-img'>
                <img src={bike.images[0]} alt='' />
                <img src='/assets/anhxemayphu.jpg' alt='' />
                <img src='/assets/anhxemayphu.jpg' alt='' />
            </div>
        </div>
        <div className='motor-detail-main'>
            <div className='motor-detail-des'>
                <div className='motor-detail-name'>{bike.title}</div>
                <div className='motor-detail-feature-1'>
                    <div className='motor-detail-rating'>3 <FontAwesomeIcon icon={faStar} /> - {bike.rental_count} chuyến đi - {bike.location}</div>
                    <div className='motor-detail-highlight'> {bike.bikeType} - Giao xe tận nơi - Đặt xe nhanh</div>
                </div>
                <div className='motor-detail-feature-2'>
                    <div className='motor-detail-feature-title'>Đặc điểm</div>
                    <div className='motor-detail-feature-2-brand'>Hãng {bike.brand}- {bike.bikeType} - dung tích {bike.capacity}  </div>
                </div>

                <div className='motor-detail-feature-2'>
                    <div className='motor-detail-feature-title'>Địa chỉ nhận xe</div>
                    <div className='motor-detail-feature-2-brand'> {bike.location}  </div>
                </div>
                
                <div className='motor-detail-feature-3'>
                    <div className='motor-detail-feature-title'>Mô tả</div>
                    <div className='motor-detail-feature-3-desc'>{bike.description}</div>
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
                    <div className='motor-detail-license'>
                        Tài sản thế chấp(chủ xe giữ lại)
                        Đặt cọc bằng tiền mặt hoặc bằng tài sản có giá trị từ 10trieu trở lên
                    </div>
                </div>
                <div className='motor-detail-policy'>
                    <div className='motor-detail-feature-title'>Chính sách hủy xe</div>

                </div>
            </div>
            <div className='motor-detail-booking'>
                <div className='motor-detail-booking-1'>
                    Phí giao nhận xe tại địa chỉ khách hàng tính theo:<br/>
                    -Dưới 5km: 50.000 vnđ / lượt <br/>
                    -Từ 5km: 10.000 vnđ / km

                </div>
                <div className='motor-detail-booking-2'>
                    <div className='motor-detail-booking-prices'>{bike.price?.perDay/1000 || 0}k/ngày</div>
                    <div className='motor-detail-booking-from-to'>
                        <div className='motor-detail-booking-from'>
                            <label>Nhận xe</label>
                            {/* <div className='wrap-date-time'>
                                <div className='wrap-date'>25/02/2025</div>
                                <div className='wrap-time'>9:00</div>
                            </div> */}
                            <div className='wrap-date-time'>
                                <input
                                type='datetime-local'
                                value={pickupDateTime}
                                onChange={(e) => setPickupDateTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='motor-detail-booking-to'>
                            <label>Trả xe</label>
                            <div className='wrap-date-time'>
                                <input
                                type='datetime-local'
                                value={returnDateTime}
                                onChange={(e) => setReturnDateTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='motor-detail-booking-address'>
                        <lable>Giao xe tận nơi</lable>
                        <div className='wrap-address'>Địa chỉ</div>
                    </div>
                    <div className='motor-detail-booking-price-duration'>
                        <div className='motor-detail-booking-price'>Đơn giá: {bike.price.perDay} vnđ/ ngày</div>
                        <div className='motor-detail-booking-duration'>Số ngày thuê: {rentalDuration.toFixed(2)} </div>

                    </div>
                    <div className='motor-detail-booking-total'>
                        Tổng cộng: {totalPrice.toLocaleString()} vnđ
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