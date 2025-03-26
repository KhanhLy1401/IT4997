import React from 'react'
import './Home.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faMagnifyingGlass, faLocationDot, faMotorcycle, faStar } from "@fortawesome/free-solid-svg-icons";
import AuthModal from '../../../components/Auth/Auth.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AddressAutocomplete from '../../../components/Address/AddressAutoComplete.js';


const Home = ({ isOpen, setIsOpen, isLogin, setIsLogin }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null); 
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();


    
    const [bikes, setBikes] = useState([]);
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bikes.length / itemsPerPage);

  // Cắt danh sách theo trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedBikes = bikes.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = () => {
    // Chuyển startDate, endDate sang chuỗi, ví dụ định dạng ISO hoặc timestamp
    const start = startDate ? startDate.toISOString() : '';
    const end = endDate ? endDate.toISOString() : '';

    // Chuyển trang kèm query params: ?location=...&start=...&end=...
    navigate(`/search?location=${encodeURIComponent(location)}&start=${start}&end=${end}`);
  };

      
    useEffect(() => {
          // Gọi API lấy dữ liệu xe từ backend
          const fetchBikes = async () => {
            try {
              const response = await axios.get('http://localhost:5000/bike/get-all-bikes');
              // Giả sử API trả về dữ liệu dạng mảng của các bike, hoặc điều chỉnh theo cấu trúc API của bạn
              setBikes(response.data);
            } catch (error) {
              console.error("Lỗi khi lấy dữ liệu xe:", error);
            }
          };
          fetchBikes();
    }, []);

  return (
    <div className='root'>
        <div className='home'>
            <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />
            <div className='hero-title'>MOTORENT - Thuê xe ngay</div>
            <div className='hero-subtitle'>Cùng bạn chinh phục mọi nẻo đường</div>
            <div className='booking-bar'>
                <div className='booking-location'>
                    <span><i class="fa-solid fa-location-dot"></i>  Địa điểm</span>
                    <span className='booking-bar-subtitle'><AddressAutocomplete onSelectAddress={(addr) => setLocation(addr)} /></span>
                </div>
                <div className='booking-date'>
                    <div className='booking-date-from'>
                    <label><FontAwesomeIcon icon={faCalendarDays}/> Từ: </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeSelect    // Cho phép chọn giờ
                      dateFormat="dd/MM/yyyy HH:mm"
                      placeholderText="Ngày bắt đầu thuê"
                    />
                        {/* <span className='booking-bar-subtitle'>Ngày bắt đầu thuê</span> */}
                    
                    </div>
                    <div className='booking-date-to'>
                      <label><FontAwesomeIcon icon={faCalendarDays}/> Đến: </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        showTimeSelect    // Cho phép chọn giờ
                        dateFormat="dd/MM/yyyy HH:mm"
                        placeholderText="Ngày trả xe"
                        minDate={startDate} // Chỉ cho phép chọn ngày sau startDate
                      />
                        {/* <span className='booking-bar-subtitle'>Ngày trả xe</span> */}
                    </div>
                    

                </div>
                {/* <div className='booking-type'>
                    <span>Hình thức</span>
                    <span className='booking-bar-subtitle'><FontAwesomeIcon icon={faMotorcycle} /> Tại cửa hàng/ nơi bạn ở</span>
                </div> */}
                <div className='booking-btn' onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />    
                </div>
            </div>
        </div>

    <div className="motor-for-you">
      <div className="motor-for-you-title">Xe dành cho bạn</div>
      <div className="motor">
        {selectedBikes.map((bike) => (
          <div key={bike._id} className="motor-img">
            <img
              src={bike.images && bike.images.length > 0 ? bike.images[0] : "/assets/anhxemay.jpg"}
              alt={bike.title}
            />
            <div>
              <div className="motor-name">{bike.title}</div>
              <div className="motor-feature">
                <div className="motor-capacity">Dung tích: {bike.description || "109cc"}</div>
                <div className="motor-type">Loại xe: {bike.bikeType || "Xe số"}</div>
                <div className="motor-brand">Hãng: {bike.brand}</div>
              </div>
              <div className="motor-address">
                <FontAwesomeIcon icon={faLocationDot} /> {bike.location}
              </div>
              <div className="motor-rating">
                4.5 <FontAwesomeIcon icon={faStar} /> - <FontAwesomeIcon icon={faMotorcycle} /> {bike.rental_count} chuyến
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút phân trang */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          ← Trước
        </button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Tiếp →
        </button>
      </div>
    </div>

        <div className='featured-locations'>
            <div className='featured-location-title'> Địa điểm nổi bật</div>
        </div>

        <div className='rental-guide'>
            <div className='rental-guide-title'>Hướng dẫn thuê xe</div>
            <div className='rental-guide-subtitle'>4 bước đơn giản bạn có thể trải nghiệm chuyến đi với Motorent</div>
            <div className='guide'>
                <div className='guide-step'>
                    <img className='guide-step-img' src='/assets/step1.jpg' alt="step1"/>
                    <div className='guide-step-title'><span>01.</span> Đặt xe trên web</div>
                </div>
                <div className='guide-step'>
                    <img className='guide-step-img' src='/assets/step2.png'alt="step2"/>
                    <div className='guide-step-title'><span>02.</span> Nhận xe</div>
                </div>
                <div className='guide-step'>
                    <img className='guide-step-img' src='/assets/step3.png' alt="step3"/>
                    <div className='guide-step-title'><span>03.</span> Bắt đầu hành trình</div>
                </div>
                <div className='guide-step'>
                    <img className='guide-step-img' src='/assets/step4.png' alt="step4"/>
                    <div className='guide-step-title'><span>04.</span> Trả xe</div>
                </div>  
            </div>
        </div>

        <div className='explore-register'>
            <div className='explore-content'>
                <div className='explore-logo'><i class="fa-solid fa-motorcycle fa-5x"></i></div>
                <h2>Bạn muốn cho <br/>thuê xe ?</h2>
                <p>Đăng ký trở thành đối tác của chúng tôi ngay hôm nay để gia <br/> tăng thu nhập hàng tháng. Bạn sẽ không mất bất kỳ <br/> chi phí nào khi đăng ký.</p>
                <a className='btn-register' href='/owner/register-form'>Đăng ký ngay</a>
            </div>
            <div className='explore-img'>
                <img src='/assets/register_owner.jpg'/>
            </div>
        </div>

        <div className=''></div>


    </div>
  )
}

export default Home;


