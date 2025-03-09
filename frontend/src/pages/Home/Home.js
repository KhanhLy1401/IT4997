import React from 'react'
import './Home.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faMagnifyingGlass, faLocationDot, faMotorcycle } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <>
    <div className='home'>
        
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

    <div className='features'>
        <div className='feature'>
            <h2>Ưu điểm của Motorent</h2>
            <div >
                <img src='/assets/bike1.png'/>
                <h3>Giao xe tận nơi</h3>
            </div>
            <div>
                <h3>Thanh toán dễ dàng</h3>
            </div>
            <div>
                <h3>Đa dạng dòng xe</h3>
            </div>
            <div>
                <h3>Đặt xe đơn giản</h3>
            </div>
        </div>
    </div>


    </>
  )
}

export default Home;