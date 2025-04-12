import React , {useState} from 'react'
import LocationPicker from '../../../../components/LocationPicker/LocationPicker';
import "./Addbike.css"

const Addbike = () => {

    const [registrationImage, setRegistrationImage] = useState(null);
    const [assuranceImage, setAssuranceImage] = useState(null);
    const [sideImage, setSideImage] = useState(null);
    const [frontImage, setFrontImage] = useState(null);
    const [licensePlateImage, setLicensePlateImage] = useState(null);

    const handleImageChange = (event, setImage) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const steps = [
        { label: "Nhập thông tin", completed: false },
        { label: "Ảnh minh chứng", completed: false },
        { label: "Chờ phê duyệt", completed: false },
        { label: "Cho thuê xe", completed: true }
      ];
    return (
        <div className='add-bike-page'>
            <div className='add-bike-description'>Đừng để xe bạn rảnh rỗi. Đăng ký ngay để kiếm thêm thu nhập</div>
            <div className = "add-bike">
            <div class="add-step">
                <i class="fa-light fa-person-biking-mountain fa-5x"></i>

                <div class="step">
                    <div class="circle">1</div>
                    <div class="line"></div>
                    <div class="label">Nhập thông tin</div>
                </div>
                <div class="step">
                    <div class="circle">2</div>
                    <div class="line"></div>
                    <div class="label">Ảnh minh chứng</div>
                </div>
                <div class="step">
                    <div class="circle">3</div>
                    <div class="line"></div>
                    <div class="label">Chờ phê duyệt</div>
                </div>
                <div class="step">
                    <div class="circle">✔</div>
                    <div class="line"></div>
                    <div class="label">Cho thuê xe</div>
                </div>
                <div class="line"></div>

            </div>

                <div className='add-form'>
                    <div className='bike-item'> 
                        <div className='bike-title'>
                            <label for="bike-title "><i class="fa-regular fa-input-text"></i> Tên xe theo giấy đăng ký xe *</label>
                            <input id="bike-title" name="bike-title"  type="text" placeholder='Nhập tên xe' required/>
                        </div>
                        <div className='bike-brand'>
                            <label for="bike-brand "><i class="fa-regular fa-globe"></i> Hãng xe *</label>
                            <input id="bike-brand" name="bike-brand"  type="text" placeholder='Nhập hãng xe' required/>
                        </div>
                    </div>
                    <div className='bike-item'>

                    </div>
                    <div className='bike-item'>
                        <div className='bike-capacity'>
                            <label for="bike-capacity "><i class="fa-regular fa-globe"></i> Dung tích *</label>
                            <input id="bike-capacity" name="bike-capacity"  type="text" placeholder='Nhập dung tích xe: Vd 109,1' required/>
                        </div>
                        <div className='bike-license-plate'>
                            <label for="bike-license-plate "><i class="fa-regular fa-rectangle-barcode"></i>  Biển số xe *</label>
                            <input id="bike-license-plate" name="bike-license-plate"  type="text" placeholder='VD: 17B2-42538' required/>
                        </div>

                    <div className='bike-type'>
                            <div><i class="fa-duotone fa-regular fa-motorcycle"></i> Loại xe * </div>
                            <div>
                                <label>
                                    <input type="radio" name="bike-type" value="Xe số"/>
                                    Xe số
                                </label>
                                
                                <label>
                                    <input type="radio" name="bike-type" value="Xe tay ga"/>
                                    Xe tay ga
                                </label>
                            </div>
                            
                        </div>
                    </div>
                
                    <div className='bike-location'>
                        <div className='bike-location-title'><i class="fa-regular fa-location-dot"></i> Địa điểm nhận xe *</div>
                        <div className='bike-location-detail'>
                            {/* <div className='bike-location-province'>
                                <label for="province">Tỉnh/Thành phố *</label>
                                <input />
                            </div>
                            <div className='bike-location-district'>
                                <label for="province">Quận/Huyện *</label>
                                <input id="province" name='province'/>
                            </div>
                            <div className='bike-location-commune'>
                                <label for="commune">Xã phường *</label>
                                <input id="commune" name='commune'/>
                            </div> */}
                            <LocationPicker/>
                        </div>
                        <div className='detail-location'>
                            <label for="detail-location">Địa chỉ cụ thể *</label>
                            <input id="detail-location" name='detail-location' placeholder='Nhập địa chỉ cụ thể số nhà, đường'/>
                            
                        </div>
                    </div>

                    <div className='bike-description'>
                        <label for="bike-description "><i class="fa-regular fa-circle-info"></i> Mô tả *</label>
                        <input id="bike-description" name="bike-description"  type="text" placeholder='Xe mới đẹp, bảo dưỡng định kì,...' required/>
                    </div>

                    <div className="bike-image-1">
                        
                        <div className='bike-registration' >
                            <label><i class="fa-regular fa-file-exclamation"></i> Chứng nhận đăng ký xe mô tô, gắn máy *</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setRegistrationImage)} required />
                            {registrationImage && <img src={registrationImage} alt="đăng ký xe" className="preview-img" />}
                        </div>
                        <div className='bike-assurance'>
                            <label><i class="fa-regular fa-file-exclamation"></i> Ảnh bảo hiểm xe còn hạn *</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setAssuranceImage)} required />
                            {assuranceImage && <img src={assuranceImage} alt="CCCD Mặt sau" className="preview-img" />}
                        </div>
                    </div>

                    <div className='bike-image-2'>
                        <div className='bike-image-item'>
                            <label><i class="fa-regular fa-camera-retro"></i> Ảnh chụp ngang xe *</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setSideImage)} required />
                            {sideImage && <img src={sideImage} alt="CCCD Mặt sau" className="preview-img" />}
                        </div>
                        <div className='bike-image-item'>
                            <label><i class="fa-regular fa-camera-retro"></i> Ảnh chụp đầu xe *</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setFrontImage)} required />
                            {frontImage && <img src={frontImage} alt="CCCD Mặt sau" className="preview-img" />}
                        </div>
                        <div className='bike-image-item'>
                            <label><i class="fa-regular fa-camera-retro"></i> Ảnh chụp biển số xe *</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setLicensePlateImage)} required />
                            {licensePlateImage && <img src={licensePlateImage} alt="CCCD Mặt sau" className="preview-img" />}
                        </div>
                    </div> 

                    <div className='bike-price'>
                        <div className='price-per'>
                            <div className='price-per-day'>
                                <label for="price-per-day"><i class="fa-regular fa-money-check-dollar"></i> Giá theo ngày *</label>
                                <input type="number" id="price-per-day" name="price-per-day" step='5' />
                            </div>
                            <div className='price-per-week'>
                                <label for="price-per-week"><i class="fa-regular fa-money-check-dollar"></i>Giá theo tuần *</label>
                                <input type="number" id="price-per-week" name="price-per-week" step='5' />
                            </div>
                            <div className='price-per-month'>
                                <label for="price-per-month"><i class="fa-regular fa-money-check-dollar"></i>Giá theo tháng *</label>
                                <input type="number" id="price-per-month" name="price-per-month" step='5'/>
                            </div>
                
                        </div>
                    </div>
                    <div className='rental-type'><i class="fa-regular fa-file"></i> Hình thức nhận xe: Nhận tại nhà chủ xe/Giao nhận tận nơi</div>
                    <div className='rental-type-price'><i class="fa-regular fa-money-check-dollar"></i> Giá giao tận nơi: 10k/km</div>

                    <button className='next-btn'>Đăng ký</button>
                    
                    
                </div>
            </div>
        </div>
    )
    }

export default Addbike;