import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <div className='left-header'>
          <div className='logo-header'>
              <img src='../../../logo.png' alt='logo' />
              <div className='title-header'>MOTORENT</div>
          </div>
          <div className='contact-header'>
              <span>Về Motorent</span>
              <span>Trở thành chủ xe</span>
          </div>  
        </div>
        
        <div className='right-header'>
          <div className='sign-up'>
              Đăng ký
          </div>
          <div className='sign-in'>
              Đăng nhập
          </div>
        </div>
    </div>
  )
}

export default Header