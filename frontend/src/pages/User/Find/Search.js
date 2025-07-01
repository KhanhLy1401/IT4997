
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Search.css';
import LocationPicker from '../../../components/LocationPicker/LocationPicker';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery();
  const initialProvince = query.get('province');
  const initialDistrict = query.get('district');
  const initialWard = query.get('ward');

  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const navigate = useNavigate();
  const { state } = useLocation();

  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [isNoDeposit, setIsNoDeposit] = useState(false);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const [location, setLocation] = useState({
    province: '',
    district: '',
    ward: '',
  });

  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const itemsPerPage = 100;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const startDate = queryParams.get('startDate');
    const startTime = queryParams.get('startTime');
    const endDate = queryParams.get('endDate');
    const endTime = queryParams.get('endTime');

    if (startDate) {
      setPickupDate(startDate);
    }

    if (startTime) {
      setPickupTime(startTime);
    }

    if (endDate) {
      setReturnDate(endDate);
    }

    if (endTime) {
      setReturnTime(endTime);
    }
  }, [queryParams]);

  useEffect(() => {
    if (state ) {
      setBikes(state);
      setFilteredBikes(state);
    }
  }, [state]);
  console.log("statebike", bikes);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 5; hour <= 22; hour++) {
      for (let min of [0, 30]) {
        if (hour === 22 && min > 0) continue;
        const hh = hour.toString().padStart(2, '0');
        const mm = min.toString().padStart(2, '0');
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  };

  const applyFilters = () => {
    if (bikes.length === 0) return;

    const filtered = bikes.filter((bike) => {
      const matchesDeposit = isNoDeposit ? bike.security_deposit === 'no_deposit' : true;
      const matchesDelivery = isDeliveryAvailable ? bike.delivery_home === true : true;
      const matchesPrice =
        bike.price >= minPrice && bike.price <= maxPrice;

      return matchesDeposit && matchesDelivery && matchesPrice;
    });

    setFilteredBikes(filtered);
    setCurrentPage(1);
  };

  const handleLocationChange = (location) => {
    setLocation({
      province: location.province || '',
      district: location.district || '',
      ward: location.ward || '',
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedBikes = filteredBikes.slice(startIndex, startIndex + itemsPerPage);
  console.log("selec", selectedBikes);

  return (
    <div className='search'>
      <div className='search-bar'>
        <div className='search-content'>
          <div className='address'>
            <i className='fa-regular fa-location-dot'></i>
            <LocationPicker
              onLocationChange={handleLocationChange}
              initialProvinceName={initialProvince}
              initialDistrictName={initialDistrict}
              initialWardName={initialWard}
            />
          </div>

          <div className='time'>
            <i className='fa-light fa-calendar-days'></i>
            <input
              type='date'
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
            <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>{' '}
            -{' '}
            <input
              type='date'
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
            <select value={returnTime} onChange={(e) => setReturnTime(e.target.value)}>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {/* <div>Tìm kiếm</div> */}
          </div>
          
        </div>
        <div className='search-filter'>
          <div className='repeat-filter'>
            <i className='fa-solid fa-repeat'></i>
          </div>
          <div className='filter-options'>
            <label>
              <input
                type='checkbox'
                checked={isNoDeposit}
                onChange={(e) => setIsNoDeposit(e.target.checked)}
              />
              Miễn thế chấp
            </label>
            <label>
              <input
                type='checkbox'
                checked={isDeliveryAvailable}
                onChange={(e) => setIsDeliveryAvailable(e.target.checked)}
              />
              Giao tận nơi
            </label>
            <div className='price-range'>
              <label>
                Giá từ:
                <input
                  className='price-from-to'
                  type='number'
                  value={minPrice}
                  step="5000"
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
              </label>
              <label>
                Giá đến:
                <input
                  className='price-from-to'
                  type='number'
                  value={maxPrice}
                  step="5000"
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </label>
              
            </div>
            <div className='filter-btn' onClick={applyFilters}>
                <i className='fa-solid fa-magnifying-glass'></i> Lọc
              </div>
          </div>
        </div>
      </div>
      <div className='result'>
        <div className='motor'>
          
          {selectedBikes.map((bike) => (
            <div
              key={bike._id}
              onClick={() => navigate(`/motor-detail/${bike._id}`, {state: {startDate: pickupDate, endDate: returnDate, startTime: pickupTime, endTime: returnTime, distance: bike.distance, province:initialProvince, district:initialDistrict, ward: initialWard}})}
              className='motor-img'
            >
              <img
                src={bike.images?.front?.url || '/assets/anhxemay.jpg'}
                alt={bike.title}
              />
              <div>
                <div className='motor-name'>{bike.title}</div>
                <div className='motor-feature'>
                  <div className='motor-capacity'>
                    Dung tích: {bike.capacity}cm<sup>3</sup> - <span className='distance-search'>{(Math.ceil(bike?.distance / 10) / 100).toFixed(2)} km</span>
                  </div>
                  <div className='motor-type'>
                    Loại xe: {bike.bikeType || 'Xe số'}
                  </div>
                  <div className='motor-brand'>Hãng: {bike.brand}</div>
                </div>
                <div className='motor-address'>
                  <i className='fa-solid fa-location-dot'></i>{' '}
                  {bike.location?.province || 'No location'}
                </div>
                <div className='motor-rating'>
                  <div>
                  
                    <i className='fa-regular fa-suitcase-rolling luggage'></i>{' '}
                    {bike.rental_count} chuyến
                  </div>
                  <div className='motor-price'>
                    <span>{bike.price / 1000 || 0}K</span>/ngày
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
