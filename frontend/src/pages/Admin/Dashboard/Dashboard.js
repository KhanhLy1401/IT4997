import React from 'react'
import './Dashboard.css'

const Dashboard = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    console.log('URL là:', API_URL);
    
  return (
    <div className='dashboard'>
        <div>Tổng quan</div>
        <div className='db-overview'>
            <div className='db-card'>
                <div className='db-card-title'>Số khách hàng</div>
                <div className='db-card-value'>100</div>
                {/* <div className='db-card-subtitle'>Khách hàng</div> */}
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Số lượng chủ xe</div>
                <div className='db-card-value'>30</div>
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Tổng số xe</div>
                <div className='db-card-value'>120</div>
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Số lượt thuê xe</div>
                <div className='db-card-value'>300</div>
            </div>
        </div>
        <div className='db-charts'>
            <div className='db-chart'>Biểu đồ lượng xe</div>
        </div>
    </div>
  )
}

export default Dashboard;