import React from 'react'
import './Home.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faMagnifyingGlass, faLocationDot, faMotorcycle, faStar } from "@fortawesome/free-solid-svg-icons";
import AuthModal from '../../../components/Auth/Auth.js';


const Home = ({ isOpen, setIsOpen, isLogin, setIsLogin }) => {
  return (
    <div className='root'>
        <div className='home'>
            <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />
            <div className='hero-title'>MOTORENT - Thuê xe ngay</div>
            <div className='hero-subtitle'>Cùng bạn chinh phục mọi nẻo đường</div>
            <div className='booking-bar'>
                <div className='booking-location'>
                    <span>Địa điểm</span>
                    <span className='booking-bar-subtitle'><FontAwesomeIcon icon={faLocationDot} />Chọn địa điểm của bạn</span>
                </div>
                <div className='booking-date'>
                    <div className='booking-date-from'>
                        <span>Từ</span>
                        <span className='booking-bar-subtitle'><FontAwesomeIcon icon={faCalendarDays}/>Ngày bắt đầu thuê</span>
                    
                    </div>
                    <div className='booking-date-to'>
                        <span>Đến</span>
                        <span className='booking-bar-subtitle'><FontAwesomeIcon icon={faCalendarDays}/>Ngày trả xe</span>
                    </div>
                    

                </div>
                <div className='booking-type'>
                    <span>Hình thức</span>
                    <span className='booking-bar-subtitle'><FontAwesomeIcon icon={faMotorcycle} /> Tại cửa hàng/ nơi bạn ở</span>
                </div>
                <div className='booking-btn'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />    
                </div>
            </div>
        </div>

        <div className='motor-for-you'>
            <div className='motor-for-you-title'>Xe dành  cho bạn</div>
            <div className='motor'>
                <div className='motor-img'>
                    <img src='/assets/anhxemay.jpg' alt=''/>
                    <div>
                        <div className='motor-name'>WAVE ALPHA 2023</div>
                        <div className='motor-feature'>
                            <div className='motor-capacity'>Dung tích: 109cc</div>
                            <div className='motor-type'>Loại xe: Xe số</div>
                            <div className='motor-brand'>Hãng: HONDA</div>
                        </div>
                        <div className='motor-address'><FontAwesomeIcon icon={faLocationDot} />Quận Bình Thạnh, TP.Hồ Chí Minh</div>
                        <div className='motor-rating'>4.5 <FontAwesomeIcon icon={faStar} /> - <FontAwesomeIcon icon={faMotorcycle} /> 2 chuyến</div>
                        
                    </div>
                </div>
                

                <div className='motor-img'>
                    <img src='/assets/anhxemay.jpg' alt=''/>
                    <div>
                        <div className='motor-name'>WAVE ALPHA 2023</div>
                        <div className='motor-feature'>
                            <div className='motor-capacity'>Dung tích: 109cc</div>
                            <div className='motor-type'>Loại xe: Xe số</div>
                            <div className='motor-brand'>Hãng: HONDA</div>
                        </div>
                        <div className='motor-address'><FontAwesomeIcon icon={faLocationDot} />Quận Bình Thạnh, TP.Hồ Chí Minh</div>
                        <div className='motor-rating'>4.5 <FontAwesomeIcon icon={faStar} /> - <FontAwesomeIcon icon={faMotorcycle} /> 2 chuyến</div>
                        
                    </div>
                </div>

                <div className='motor-img'>
                    <img src='/assets/anhxemay.jpg' alt=''/>
                    <div>
                        <div className='motor-name'>WAVE ALPHA 2023</div>
                        <div className='motor-feature'>
                            <div className='motor-capacity'>Dung tích: 109cc</div>
                            <div className='motor-type'>Loại xe: Xe số</div>
                            <div className='motor-brand'>Hãng: HONDA</div>
                        </div>
                        <div className='motor-address'><FontAwesomeIcon icon={faLocationDot} />Quận Bình Thạnh, TP.Hồ Chí Minh</div>
                        <div className='motor-rating'>4.5 <FontAwesomeIcon icon={faStar} /> - <FontAwesomeIcon icon={faMotorcycle} /> 2 chuyến</div>
                        
                    </div>
                </div>

                <div className='motor-img'>
                    <img src='/assets/anhxemay.jpg' alt=''/>
                    <div>
                        <div className='motor-name'>WAVE ALPHA 2023</div>
                        <div className='motor-feature'>
                            <div className='motor-capacity'>Dung tích: 109cc</div>
                            <div className='motor-type'>Loại xe: Xe số</div>
                            <div className='motor-brand'>Hãng: HONDA</div>
                        </div>
                        <div className='motor-address'><FontAwesomeIcon icon={faLocationDot} />Quận Bình Thạnh, TP.Hồ Chí Minh</div>
                        <div className='motor-rating'>4.5 <FontAwesomeIcon icon={faStar} /> - <FontAwesomeIcon icon={faMotorcycle} /> 2 chuyến</div>
                        
                    </div>
                </div>
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

        <div className=''></div>


    </div>
  )
}

export default Home;


