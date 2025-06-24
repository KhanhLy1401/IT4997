
import React, { useState } from 'react';
import LocationPicker from '../../../../components/LocationPicker/LocationPicker';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Addbike.css";

const Addbike = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [ownerName, setOwnerName] = useState('');
  const [title, setTitle] = useState('');
  const [bikeBrand, setBikeBrand] = useState('');
  const [bikeCapacity, setBikeCapacity] = useState('');
  const [bikeLicensePlate, setBikeLicensePlate] = useState('');
  const [bikeType, setBikeType] = useState('');
  const [bikeDescription, setBikeDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [location, setLocation] = useState({
    province: '',
    district: '',
    ward: '',
    detail_location: ''
  });
  
  const [price, setPrice] = useState(0);

  const [registrationImage, setRegistrationImage] = useState(null);
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [securityDeposit, setSecurityDeposit] = useState("no_deposit");
  const [deliveryHome, setDeliveryHome] = useState(false);
  const [sideImage, setSideImage] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [licensePlateImage, setLicensePlateImage] = useState(null);
  const [registrationPreview, setRegistrationPreview] = useState(null);
  const [insurancePreview, setInsurancePreview] = useState(null);
  const [image, setImage] = useState({front: "", back: "", side: ""});

  const handleFrontImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFrontImage(URL.createObjectURL(file));
      setImage((prev)=> ({...prev, front: file}));
    }
  };

  const handleSideImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSideImage(URL.createObjectURL(file));
      setImage((prev)=> ({...prev, side: file}));
    }
  };

  const handleBackImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLicensePlateImage(URL.createObjectURL(file));
      setImage((prev)=> ({...prev, back: file}));
    }
  };

  const handleLicenseImageChange = (event) => {
    const file = event.target.files[0];
    if(file) {
      setRegistrationPreview(URL.createObjectURL(file));
      setRegistrationImage(file);

    }
  }

  const handleInsuranceChange = (event) => {
    const file = event.target.files[0];
    if(file) {
      setInsurancePreview(URL.createObjectURL(file));
      setInsuranceImage(file);

    }
  }

  const storedId = localStorage.getItem("_id");



  const handleLocationChange = (location) => {
    setLocation({
      province: location.province,
      district: location.district,
      ward: location.ward,
      detail_location: location.detail_location
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    const formData = new FormData();

    const locationData = {

      province: location.province,
      district: location.district,
      ward: location.ward,
      detail_location: location.detail_location
    };

    const priceData =price

    formData.append("ownerId", storedId);
    formData.append("title", title);
    formData.append("ownerName", ownerName);
    formData.append("brand", bikeBrand);
    formData.append("capacity", bikeCapacity);
    formData.append("license_plate", bikeLicensePlate);
    formData.append("bikeType", bikeType);
    formData.append("description", bikeDescription);
    formData.append("location", JSON.stringify(locationData));
    formData.append("price", price);

    formData.append("bike_registration", registrationImage);
    formData.append("bike_insurance", insuranceImage);
    formData.append("security_deposit", securityDeposit);
    formData.append("delivery_home", deliveryHome); 
    formData.append("images_front", image.front);
    formData.append("images_back", image.back);
    formData.append("images_side", image.side);

    try {
      const response = await axios.post(`${API_URL}/bike/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      if (response.data.message === "Bạn đã gửi yêu  cầu rồi") {
        alert("Bạn đã gửi yêu cầu rồi. Chờ phê duyệt");
        navigate("/");
        return;
      }
      
      alert("Đăng ký xe thành công!");
      navigate("/account/bikes");

      
    } catch (error) {
      alert("Đã có lỗi xảy ra khi gửi dữ liệu.");
      console.error(error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className='add-bike-page'>
      <div className='add-bike-description'>Đăng xe</div>
      <div className="add-bike">
        <div className="add-step">
          <i className="fa-light fa-person-biking-mountain fa-5x"></i>
          {["Nhập thông tin", "Ảnh minh chứng", "Chờ phê duyệt", "Cho thuê xe"].map((label, i) => (
            <div key={i} className="step">
              <div className="circle">{i < 3 ? i + 1 : "✔"}</div>
              <div className="line"></div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>

        <div className='add-form'>
          <div className='bike-item'>
            <div className='bike-title'>
              <label htmlFor="bike-title"><i className="fa-regular fa-input-text"></i> Tên xe *</label>
              <input id="bike-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Nhập tên xe' required />
            </div>
            <div className='bike-owner-name'>
              <label htmlFor="bike-owner-name"><i className="fa-regular fa-input-text"></i> Tên chủ xe *</label>
              <input id="bike-owner-name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder='Nhập tên chủ xe' required />
            </div>
            <div className='bike-brand'>
              <label htmlFor="bike-brand"><i className="fa-regular fa-globe"></i> Nhãn hiệu *</label>
              <input id="bike-brand" value={bikeBrand} onChange={(e) => setBikeBrand(e.target.value)} placeholder='Nhập hãng xe' required />
            </div>
          </div>

          <div className='bike-item'>
            <div className='bike-capacity'>
              <label htmlFor="bike-capacity"><i className="fa-regular fa-globe"></i> Dung tích *</label>
              <input id="bike-capacity" value={bikeCapacity} onChange={(e) => setBikeCapacity(e.target.value)} placeholder='VD: 109,1' required />
            </div>
            <div className='bike-license-plate'>
              <label htmlFor="bike-license-plate"><i className="fa-regular fa-rectangle-barcode"></i> Biển số đăng ký *</label>
              <input id="bike-license-plate" value={bikeLicensePlate} onChange={(e) => setBikeLicensePlate(e.target.value)} placeholder='VD: 17B2-42538' required />
            </div>

            <div className='bike-type'>
              <div><i className="fa-regular fa-motorcycle"></i> Loại xe * </div>
              <label><input type="radio" name="bike-type" value="Xe số" checked={bikeType === "Xe số"} onChange={() => setBikeType("Xe số")} /> Xe số</label>
              <label><input type="radio" name="bike-type" value="Xe tay ga" checked={bikeType === "Xe tay ga"} onChange={() => setBikeType("Xe tay ga")} /> Xe tay ga</label>
            </div>
          </div>

          <div className='bike-location'>
            <div className='bike-location-title'><i className="fa-regular fa-location-dot"></i> Địa điểm nhận xe *</div>
            <div className='bike-location-detail'>
              <LocationPicker onLocationChange={handleLocationChange}/>
            </div>
            <div className='detail-location'>
              <label htmlFor="detail-location">Địa chỉ cụ thể *</label>
              <input id="detail-location" value={location.detail_location} onChange={(e) => setLocation({...location, detail_location:e.target.value})} placeholder='Nhập địa chỉ cụ thể' required />
            </div>
          </div>

          <div className='bike-description'>
            <label htmlFor="bike-description"><i className="fa-regular fa-circle-info"></i> Mô tả *</label>
            <input id="bike-description" value={bikeDescription} onChange={(e) => setBikeDescription(e.target.value)} placeholder='Xe mới đẹp, bảo dưỡng định kì,...' required />
          </div>

          <div className="bike-image-1">
            <div className='bike-registration'>
              <label><i className="fa-regular fa-file-exclamation"></i> Chứng nhận đăng ký *</label>
              <input type="file" accept="image/*" onChange={handleLicenseImageChange} required />
            </div>
            <div className='bike-assurance'>
              <label><i className="fa-regular fa-file-exclamation"></i> Bảo hiểm xe *</label>
              <input type="file" accept="image/*" onChange={handleInsuranceChange} required />
            </div>
          </div>

          <div className='bike-image-2'>
            <div className='bike-image-item'>
              <label><i className="fa-regular fa-camera-retro"></i> Ảnh ngang xe *</label>
              <input type="file" accept="image/*" onChange={handleSideImageChange} required />
            </div>
            <div className='bike-image-item'>
              <label><i className="fa-regular fa-camera-retro"></i> Ảnh đầu xe *</label>
              <input type="file" accept="image/*" onChange={handleFrontImageChange} required />
            </div>
            <div className='bike-image-item'>
              <label><i className="fa-regular fa-camera-retro"></i> Ảnh biển số *</label>
              <input type="file" accept="image/*" onChange={handleBackImageChange} required />
            </div>
          </div>

          <div className='bike-price'>
            <div className='price-per'>
              <div className='price-per-day'>
                <label htmlFor="price-per-day"><i className="fa-regular fa-money-check-dollar"></i> Giá theo ngày *</label>
                <input type="number" id="price-per-day" value={price} onChange={(e) => setPrice(e.target.value)} step='5000' />
              </div>
            </div>
          </div>

          <div className='bike-security-deposit'>
            <label><i className="fa-regular fa-lock"></i> Thế chấp khi thuê xe</label>
            <input
              type="text"
              placeholder="Nhập số tiền hoặc để trống nếu không cần thế chấp "
              value={securityDeposit === "no_deposit" ? "" : securityDeposit}
              onChange={(e) => {
                const val = e.target.value.trim();
                setSecurityDeposit(val === "" ? "no_deposit" : val);
              }}
            />
          </div>

          <div className='bike-delivery-option'>
            <label>
              <input
                type="checkbox"
                checked={deliveryHome}
                onChange={(e) => setDeliveryHome(e.target.checked)}
              /> Giao xe tận nơi
            </label>
          </div>


          <div className='rental-type'><i className="fa-regular fa-file"></i> Hình thức nhận xe: Nhận tại nhà chủ xe/Giao nhận tận nơi</div>
          <div className='rental-type-price'><i className="fa-regular fa-money-check-dollar"></i> Giá giao tận nơi: 10k/km</div>

          <button className='next-btn' type= "submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký xe'}
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default Addbike;
