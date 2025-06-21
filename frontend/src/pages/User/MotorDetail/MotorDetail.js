import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faStar } from "@fortawesome/free-solid-svg-icons";
import './MotorDetail.css'
import { useParams } from "react-router-dom";
import axios from 'axios';

const MotorDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();
    const [bike, setBike] = useState();
    const API_URL = process.env.REACT_APP_API_URL;
    const API_FLASK = process.env.REACT_APP_API_FLASK;
    const [pickupDate, setPickupDate] = useState('');
    const [pickupDateTime, setPickupDateTime] = useState('');
    const [pickupTime, setPickupTime] = useState("05:00");
    const [returnDate, setReturnDate] = useState('')
    const [returnDateTime, setReturnDateTime] = useState('')
    const [returnTime, setReturnTime] = useState('05:00')
    const [rentalDuration, setRentalDuration] = useState(0) // đơn vị ngày (thập phân)
    let [totalPrice, setTotalPrice] = useState(0)
    const [comment, setComment] = useState(null);
    const [avarageRating, setAvarageRating] = useState(null);
    const {state} = useLocation();
    const [isDelivery, setIsDelivery] = useState(false);
    const [address, setAddress] = useState('');
    const [recommendBikes, setRecommendBikes]=useState();

    const handleDeliveryChange = (e) => {
        setIsDelivery(e.target.checked);
    };

    useEffect(()=>{
        if(state){
            setPickupDate(state.startDate);
            setPickupTime(state.startTime);
            setReturnDate(state.endDate);
            setReturnTime(state.endTime);
        }
        setPickupDateTime(getCombinedDateTime(pickupDate, pickupTime));
        setReturnDateTime(getCombinedDateTime(returnDate, returnTime));
        console.log("datetime", pickupDateTime+returnDateTime)
      

        const pickup = new Date(pickupDateTime);
        const dropoff = new Date(returnDateTime);
      
        const diffInMs = dropoff - pickup;
        const diffInHours = diffInMs / (1000 * 60 * 60);
      
        if (diffInHours > 0) {
          const days = diffInHours / 24;
          setRentalDuration(days);
      
          const pricePerDay = bike.price || 0;
          console.log("gia", bike.price);
          const price = Math.ceil(pricePerDay * days);
          setTotalPrice(price);
        } else {
          setRentalDuration(0);
          setTotalPrice(0);
        }
    }
    , [pickupDate, pickupTime, returnDate, returnTime])

    const getCombinedDateTime = (date, time) => {
        return `${date}T${time}`;
    };
      

    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 5; hour <= 22; hour++) {
          for (let min of [0, 30]) {
            if (hour === 22 && min > 0) continue; // giới hạn đến 22:00
            const hh = hour.toString().padStart(2, "0");
            const mm = min.toString().padStart(2, "0");
            options.push(`${hh}:${mm}`);
          }
        }
        return options;
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/bike/${id}`);
                const response2 = await axios.get(`${API_URL}/review/get-by-bike/${id}`);
                setBike(response.data);
                setComment(response2.data.reviews);
                setAvarageRating(response2.data.averageRating);
                const recommendation = await axios.get(`${API_FLASK}/recommend/content?bikeId=${id}`)
                setRecommendBikes(recommendation.data);                
            } catch (error) {
                console.error('Lỗi lấy chi tiets xe:', error.message);
            }
        };

        fetchData();

    }, [API_URL,id]);


    useEffect(() => {
        if (!bike || !bike.price) return;
        setPickupDateTime(getCombinedDateTime(pickupDate, pickupTime));
        setReturnDateTime(getCombinedDateTime(returnDate, returnTime));
        console.log("datetime", pickupDateTime+returnDateTime)
      

        const pickup = new Date(pickupDateTime);
        const dropoff = new Date(returnDateTime);
      
        const diffInMs = dropoff - pickup;
        const diffInHours = diffInMs / (1000 * 60 * 60);
      
        if (diffInHours > 0) {
          const days = diffInHours / 24;
          setRentalDuration(days);
      
          const pricePerDay = bike.price || 0;
          const price = Math.ceil(pricePerDay * days);
          setTotalPrice(price);
        } else {
          setRentalDuration(0);
          setTotalPrice(0);
        }
      }, [pickupDate, pickupTime, returnDate, returnTime, bike]); 

      
  if (!bike) {
    return <div>
        <div style={{ textAlign: "center", marginTop: "40px" }}>
            <i className="fas fa-spinner fa-spin fa-3x" style={{ color: "#12b76a" }}></i>
            <p>Đang tìm thông tin xe...</p>
            </div>
    </div>;
  }



  const handleRentalChange = () => {

    if (!localStorage.getItem('user')) {
        alert("Vui lòng đăng nhập để thuê xe.");
        return;
    }
   
    if (totalPrice===0) {
        alert("Vui lòng chọn thời gian nhận và trả xe.");
        return;
    };

    console.log(pickupDateTime, "picu")
    navigate(`/rental-form/${bike._id}`, {state: {bikeId: bike._id, bikeTitle: bike.title, bikeOwnerId: bike.ownerId, bikeImage: bike.images?.front?.url || "img", bikeCapacity: bike.capacity, startDate: pickupDate, endDate: returnDate, startTime: pickupTime, endTime: returnTime, rentalDuration: rentalDuration, bikePrice: bike.price||"", totalPrice: totalPrice, isDelivery: isDelivery}})
  }

  return (
    <div className='motor-detail'>

        <div className='motor-detail-imgs'>
            <div className='md-main-img'>
                <img src={bike.images?.front?.url||'/assets/anhxemayphu.jpg'} alt='' />
            </div>
            <div className='md-sub-img'>
                <img src={bike.images?.back?.url || '/assets/anhxemayphu.jpg'} alt='' />
                <img src={bike.images?.side?.url || '/assets/anhxemayphu.jpg'} alt='' />
            </div>
        </div>
        


        <div className='motor-detail-main'>
            <div className='motor-detail-des'>
                <div className='motor-detail-name'>{bike.title}</div>
                <div className='motor-detail-feature-1'>
                    <div className='motor-detail-rating'>3 <FontAwesomeIcon icon={faStar} /> - {bike.rental_count} chuyến đi - {bike.location?.province || "No location"}</div>
                    <div className='motor-detail-highlight'> {bike.bikeType} - Giao xe tận nơi - Đặt xe nhanh</div>
                </div>
                <div className='motor-detail-feature-2'>
                    <div className='motor-detail-feature-title'>Đặc điểm</div>
                    <div className='motor-detail-feature-2-brand'>Hãng xe: {bike.brand} <br/> Loại xe: {bike.bikeType} <br/> Dung tích: {bike.capacity} cm<sup>3</sup>  </div>
                </div>

                <div className='motor-detail-feature-2'>
                    <div className='motor-detail-feature-title'>Địa chỉ nhận xe</div>
                    <div className='motor-detail-feature-2-brand'> {(bike.location?.ward + ", "+  bike.location?.district + ", "+ bike.location?.province) || "No location"}  </div>
                </div>
                
                <div className='motor-detail-feature-3'>
                    <div className='motor-detail-feature-title'>Mô tả</div>
                    <div className='motor-detail-feature-3-desc'>Xe đã trang bị đầy đủ 2 mũ bảo hiểm khi nhận xe <br/> Xe có đầy đủ giấy tờ và bảo hiểm xe máy <br/>{bike.description}</div>
                </div>
                <div className='motor-detail-licenses'>
                    <div className='motor-detail-feature-title'>Giấy tờ thuê xe</div>
                    <div className='motor-detail-license'>
                        GPLX(đối chiếu) & CCCD(đối chiếu VNeID) <br/>
                        GPLX(đối chiếu) & Passport(giữ lại) <br/>
                    </div>
                    

                </div>
                <div className='motor-detail-terms'>
                    <div className='motor-detail-feature-title'>Điều khoản thuê xe</div>
                    <div className='motor-detail-license'>
                        Tài sản thế chấp(chủ xe giữ lại) <br/>
                        {bike?.security_deposit=="no_deposit"?"Miễn thế chấp tài sản":bike.security_deposit}

                    </div>
                </div>
                <div className='motor-detail-policy'>
                    <div className='motor-detail-feature-title'>Chính sách hủy xe</div>
                            <div className='motor-detail-license'>
                                Hủy trước thời gian nhận xe ít nhất là 6 tiếng <br />
                                Phí hủy: 10% giá trị đơn hàng


                            </div>
                </div>
                <div>
                    <div className='motor-detail-feature-title'>Xe tương tự cho bạn</div>
                    <div className="motor" >
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

                </div>

                {comment? <div class="review-container">
                    
                    <div class="review-header">
                    
                    
                    </div>

                        {comment && comment.length > 0 && (
                        <div className="motor-detail-comments">
                            <div className="motor-detail-feature-title">Đánh giá</div>
                            <span class="star"><i className="fa-solid fa-star"></i></span>
                            <span class="rating">{avarageRating} </span>
                            <span class="count">• {comment?.length} đánh giá</span>
                            {comment.map((c, i) => (
                            <div class="review-box">
                            <img src="/assets/avatar.png" alt="Avatar" class="avatar" />
                                <div class="review-content">
                                    <div class="review-top">
                                    <span class="name">user{c.userId}</span>
                                    <span class="date">{c.createdAt.slice(0, 10)}</span>
                                    </div>
                                    <div class="stars">{[...Array(c.rating)].map((_, index) => (
                                        <i className="fa-solid fa-star"></i>
                                    ))}</div>
                                    <p class="comment">{c.comment}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                        

                    {/* <div class="see-more">
                    <button>Xem thêm</button>
                    </div> */}
                </div>: ""}
                
            </div>
            <div className='motor-detail-booking'>
                <div className='motor-detail-booking-1'>
                    Phí giao nhận xe tại địa chỉ khách hàng tính theo:<br/>
                    -Dưới 10km: 10.000 vnđ / km <br/>
                    -Từ 10km: 7.000 vnđ / km

                </div>
                <div className='motor-detail-booking-2'>
                    <div className='motor-detail-booking-prices'>{bike.price/1000 || 0}k/ngày</div>
                    <div className='motor-detail-booking-from-to'>
                        <div className='motor-detail-booking-from'>
                            <label>Nhận xe</label>
                            <div className='wrap-date-time'>
                                <input
                                    type='date'
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    required
                                />
                                <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
                                    {generateTimeOptions().map((time) => (
                                        <option key={time} value={time}>{time}</option>
                                ))}
                                </select>
                            </div>
                        </div>
                        <div className='motor-detail-booking-to'>
                            <label>Trả xe</label>
                            <div className='wrap-date-time'>
                                <input
                                    type='date'
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    required
                                />
                                <select value={returnTime} onChange={(e) => setReturnTime(e.target.value)}>
                                    {generateTimeOptions().map((time) => (
                                        <option key={time} value={time}>{time}</option>
                                ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='motor-detail-booking-address'>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={isDelivery} 
                                onChange={handleDeliveryChange} 
                            />
                            Giao xe tận nơi
                        </label>

                        {isDelivery && (
                            <div className='delivery-address'>
                                <div>{state?.province}, {state?.district}, {state?.ward}</div>
                                <label htmlFor='address'>Địa chỉ cụ thể: <br/></label>
                                <input
                                    id='address'
                                    type='text'
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder='Nhập địa chỉ nhận xe'
                                    required
                                />
                                <div className='address-distance'>Khoảng cách giao xe: {(Math.ceil(state?.distance / 10) / 100).toFixed(2)} km</div>
                            </div>
                        )}
                    </div>
    
                    <div className='motor-detail-booking-price-duration'>
                        <div className='motor-detail-booking-price'>Đơn giá: {bike.price || "0"} vnđ/ ngày</div>
                        <div className='motor-detail-booking-duration'>Số ngày thuê: {rentalDuration.toFixed(2)} </div>

                    </div>
                    <div className='motor-detail-booking-total'>
                        Tổng cộng: {isDelivery
                            ? (Math.round((totalPrice + Math.ceil(state?.distance / 10) / 100) * 10)).toLocaleString()
                            : totalPrice.toLocaleString()} vnđ
                    </div>
                    <div className='motor-detail-booking-btn' onClick={() =>handleRentalChange() }>
                        Chọn thuê
                    </div>

                    
                </div>
                <div className='extra-charge'>
                    {/* Phụ phí */}
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default MotorDetail