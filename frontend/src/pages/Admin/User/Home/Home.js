import './Home.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationPicker from '../../../components/LocationPicker/LocationPicker.js';


const Home = () => {
  const API_URL = process.env.REACT_APP_API_URL;


  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState("hh:mm");
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('hh:mm')
  const navigate = useNavigate();
  const [location, setLocation] = useState({
      province: '',
      district: '',
      ward: '',
  });




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

    
    const [bikes, setBikes] = useState([]);
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bikes.length / itemsPerPage);

  const handleLocationChange = (location) => {
    setLocation({
      province: location.province,
      district: location.district ,
      ward: location.ward ,
    });
  };


  // Cắt danh sách theo trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedBikes = bikes.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = async () => {
    if (
      !pickupDate ||
      pickupTime === "hh:mm" ||
      !returnDate ||
      returnTime === "hh:mm"
    ) {
      alert("Vui lòng điền đầy đủ ngày và giờ nhận/trả xe!");
      return;
    }


    try {
      const response = await axios.post(`${API_URL}/bike/search`, {
        province: location.province,
        district: location.district, 
        ward: location.ward,         
        startDate: pickupDate,
        startTime: pickupTime,
        endDate: returnDate,
        endTime: returnTime
      } );
      console.log("Kết quả tìm kiếm:", response.data);
      navigate(`/search?province=${location.province}&district=${location.district}&ward=${location.ward}&startDate=${pickupDate}&startTime=${pickupTime}&endDate=${returnDate}&endTime=${returnTime}`, {
        state: response.data
      });
  
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.message);
      alert("Không thể tìm xe, vui lòng thử lại sau!");
      return;
    }


  };

      
    useEffect(() => {
          const fetchBikes = async () => {
            try {
              const response = await axios.get(`${API_URL}/bike/get-all-bikes`);
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
            <div className='hero-title'>MOTORENT - Thuê xe ngay</div>
            <div className='hero-subtitle'>Cùng bạn chinh phục mọi nẻo đường</div>
            <div className="home-line"></div>
            <div className='sub-title'>Trải nghiệm sự khác biệt từ hơn các loại xe trên khắp miền Bắc </div>
            <div className='booking-bar'>
                <div className='booking-bar-title'>Bạn cần thuê xe máy ?</div>
                <div className='booking-location'>
                    {/* <span className='booking-bar-subtitle'><AddressAutocomplete onSelectAddress={(addr) => setLocation(addr)} /></span> */}
                    <span className='booking-bar-subtitle'><LocationPicker onLocationChange={handleLocationChange} /></span>
                </div>
                <div className='booking-date'>
                    <div className='booking-date-from'>

                      <div className='booking-date-title'>Ngày nhận xe - Giờ nhận xe</div>
                      <div className='booking-day'>
                        <input
                          className="day-time-pick"
                          type='date'
                          value={pickupDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setPickupDate(e.target.value)}
                          required
                        />
                        <select className="day-time-pick" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>

                          <option value="hh:mm"  disabled>hh:mm</option>
                          {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                          <i class="fa-solid fa-calendars"></i>
                      </div>
                    
                    </div>
                    <div className='booking-date-to'>
                      <div className='booking-date-title'>Ngày trả xe-Giờ trả xe</div>

                      <div className='booking-day'>
                        <input
                            className="day-time-pick"
                            type='date'
                            value={returnDate}
                            min={pickupDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            required
                          />
                          <select className="day-time-pick" value={returnTime} onChange={(e) => setReturnTime(e.target.value)}>
                          <option value="hh:mm" disabled>hh:mm</option>
                          {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                          </select>
                        <i class="fa-solid fa-calendars"></i></div>
                    </div>
                    

                </div>

                <div className='booking-btn' onClick={handleSearch}>
                    Tìm xe giá tốt
                </div>
            </div>
        </div>

        <div className="motor-for-you">
          <div className="motor-for-you-title">Xe dành cho bạn</div>
          <div className="motor" >
            {selectedBikes.map((bike) => (
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

        <div className='advantage'>
            <div className='advantage-title'>Lợi ích của Motorent</div>
            <div className='advantage-detail'>
              <div className='advantage-item'>
                  <div className='ad-item'>
                    <i class="fa-solid fa-moped fa-3x"></i>
                    <div className='ad-item-title'>
                      <h2>Nhiều lựa chọn</h2>
                      <div className='ad-item-subtitle'>Hàng trăm loại xe đa dạng ở nhiều địa điểm trên cả nước, phù hợp với mọi mục đích của bạn</div>
                    </div>
                  </div>
                  <div className='ad-item'>
                    <i class="fa-solid fa-shield-check fa-3x"></i>
                    <div className='ad-item-title'>
                      <h2>Tin cậy</h2>
                      <div className='ad-item-subtitle'>Các xe đều được bảo dưỡng thường xuyên</div>
                    </div>
                  </div>
              </div>
              <div className='advantage-item'>
                <div className='ad-item'>
                    <i class="fa-solid fa-comments-question-check fa-3x"></i>
                    <div className='ad-item-title'>
                      <h2>Hỗ trợ 24/7</h2>
                      <div className='ad-item-subtitle'>Có nhân viên hỗ trợ khách hàng trong suốt quá trình thuê xe</div>
                    </div>
                </div>
                <div className='ad-item'>
                    <i class="fa-solid fa-paper-plane fa-3x"></i>
                    <div className='ad-item-title'>
                      <h2>Thuận tiện</h2>
                      <div className='ad-item-subtitle'>Dễ dàng tìm kiếm, so sánh và đặt chiếc xe như ý với chỉ vài click chuột</div>
                    </div>
                </div>
              </div>
              <div className='advantage-item'>
                <div className='ad-item'>
                    <i class="fa-solid fa-tags fa-3x"></i>
                    <div className='ad-item-title'>
                      <h2>Giá cả cạnh tranh</h2>
                      <div className='ad-item-subtitle'>Giá thuê được niêm yết công khai và thường rẻ hơn so với giá truyền thống</div>
                    </div>
                </div>
                <div className='ad-item'>
                    <i class="fa-solid fa-shield-plus fa-3x"></i>
                    <div className='ad-item-title'>
                      <h2>Bảo hiểm</h2>
                      <div className='ad-item-subtitle'>An tâm với các gói bảo hiểm thuê xe tự lái trong suốt quá trình thuê xe</div>
                    </div>
                </div>
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
                <img src='/assets/register_owner.jpg' alt=''/>
            </div>
        </div>

        <div className='rental-guide'>
            <div className='rental-guide-title'>Hướng dẫn thuê xe</div>
            <div className='rental-guide-subtitle'>4 bước đơn giản bạn có thể trải nghiệm chuyến đi với Motorent</div>
            <div className='guide'>
                <div className='guide-step'>
                    <img className='guide-step-img' src='/assets/step1.png' alt="step1"/>
                    <div className='guide-step-title'><span>01.</span> Đặt xe trên web</div>
                </div>
                <div className='guide-step'>
                    <img className='guide-step-img' src='/assets/step2.png'alt="step2"/>
                    <div className='guide-step-title'><span>02.</span> Nhận xe</div>
                </div>
                <div className='guide-step'>
                    <img className='guide-step-img' src='/assets/step3.png' alt="step3"/>
                    <div className='guide-step-title'><span>03.</span> Bắt đầu chạy</div>
                </div>
                <div className='guide-step'>
                    <img className='guide-step-img' src='/assets/step4.png' alt="step4"/>
                    <div className='guide-step-title'><span>04.</span> Trả xe</div>
                </div>  
            </div>
        </div>

        <div className=''></div>


    </div>
  )
}

export default Home;



