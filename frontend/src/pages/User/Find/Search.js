import React, {useState, useEffect} from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Search.css'
import LocationPicker from '../../../components/LocationPicker/LocationPicker';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

 
const Search = () => {
  const query = useQuery();
  const initialProvince = query.get('province');   // Tỉnh Cao Bằng
  const initialDistrict = query.get('district');   // Huyện Hà Quảng
  const initialWard = query.get('ward');
  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const navigate = useNavigate();

  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')

  useEffect(() => {
    const startDate = queryParams.get("startDate");
    const startTime = queryParams.get("startTime");
    const endDate = queryParams.get("endDate");
    const endTime = queryParams.get("endTime");
    if (startDate ) {
      setPickupDate(startDate);
    }

    if (startTime ) {
      setPickupTime(startDate);
    }

    if (endDate ) {
      setReturnDate(endDate);
    }

    if (endTime) {
      setReturnTime(endTime)
    }
  }, [queryParams]); 

  const [location, setLocation] = useState({
        province: '',
        district: '',
        ward: '',
  });

  const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_API_URL;

  

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


  // Chuyển chuỗi ngày giờ thành đối tượng Date (nếu cần format)



  const [bikes, setBikes] = useState([]);
      const itemsPerPage = 100;
      const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(bikes.length / itemsPerPage);
  
    // Cắt danh sách theo trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedBikes = bikes.slice(startIndex, startIndex + itemsPerPage);
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

    const handleLocationChange = (location) => {
      setLocation({
        province: location.province || '',
        district: location.district || '',
        ward: location.ward || '',
      });
    };

  return (
    <div className='search'>
      <div className='search-bar'>
        <div className='search-content'>
          <div className="address">
            <i className="fa-regular fa-location-dot"></i> 
            <LocationPicker onLocationChange={handleLocationChange} initialProvinceName={initialProvince} initialDistrictName={initialDistrict} initialWardName={initialWard} />
          </div>

          {/* Hiển thị thời gian */}
          <div className="time">
            <i className="fa-light fa-calendar-days"></i>
            {""}
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
            </select> - 
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
          <div className="filter-btn"><i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm</div>
        </div>
        <div className='search-filter'>
          <div className='repeat-filter'><i class="fa-solid fa-repeat"></i></div>
          <div className='filter-item'> <i class="fa-regular fa-copyright"></i> Hãng xe</div>
          <div className='filter-item'> <i class="fa-regular fa-bolt"></i> Đặt xe nhanh</div>
          <div className='filter-item'><i class="fa-regular fa-location-dot"></i> Giao tận nơi</div>
          <div className='filter-item'><i class="fa-regular fa-circle-minus"></i> Miễn thế chấp</div>
          <div className='slider-filter'><i class="fa-solid fa-sliders"></i> Bộ lọc</div>
        </div>
      </div>
      <div className='result'>
        <div className="motor">
          {selectedBikes.map((bike) => (
            <div key={bike._id} onClick={() => navigate(`/motor-detail/${bike._id}`)} className="motor-img">
              <img
                src={bike.images?.front?.url || "/assets/anhxemay.jpg"}
                alt={bike.title}
              />
              <div>
                <div className="motor-name">{bike.title}</div>
                <div className="motor-feature">
                  <div className="motor-capacity">Dung tích: {bike.capacity}cm<sup>3</sup> </div>
                  <div className="motor-type">Loại xe: {bike.bikeType || "Xe số"}</div>
                  <div className="motor-brand">Hãng: {bike.brand}</div>
                </div>
                <div className="motor-address">
                  <i class="fa-solid fa-location-dot"></i> {bike.location?.province || "No location"}
                </div>
                <div className="motor-rating">
                    <div>4.5 <i className="fa-solid fa-star yellow-star"></i> - <i className="fa-regular fa-suitcase-rolling luggage"  ></i> {bike.rental_count} chuyến</div>
                    <div className='motor-price'> <span>{bike.price?.perDay/1000  || 0}K</span>/ngày </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search