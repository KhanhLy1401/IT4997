import React, {useState, useEffect} from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faMagnifyingGlass, faLocationDot, faMotorcycle, faStar } from "@fortawesome/free-solid-svg-icons";
import './Search.css'

const Search = () => {
  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);

  const locationParam = queryParams.get("location"); // "Hà Nam Province, Vietnam"
  const startParam = queryParams.get("start");       // "2025-02-27T15:00:00.000Z"
  const endParam = queryParams.get("end");           // "2025-03-06T14:30:00.000Z"

  // Chuyển chuỗi ngày giờ thành đối tượng Date (nếu cần format)
  const startDate = startParam ? new Date(startParam) : null;
  const endDate = endParam ? new Date(endParam) : null;

  // Format ngày giờ (dùng toLocaleString hoặc thư viện date-fns nếu cần)
  const startText = startDate ? startDate.toLocaleString() : "";
  const endText = endDate ? endDate.toLocaleString() : "";


  const [bikes, setBikes] = useState([]);
      const itemsPerPage = 20;
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

  return (
    <div className='search'>
      <div className='search-bar'>
        <div className='search-content'>
          <div className="address">
            <i className="fa-regular fa-location-dot"></i> 
            {""}
            {locationParam}
          </div>

          {/* Hiển thị thời gian */}
          <div className="time">
            <i className="fa-light fa-calendar-days"></i>
            {""}
            {startText} - {endText}
          </div>
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
                  <FontAwesomeIcon icon={faLocationDot} /> {bike.location?.province || "No location"}
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