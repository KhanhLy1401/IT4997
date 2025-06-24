import React from 'react'
import axios from 'axios';
import './Dashboard.css'
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

const Dashboard = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    // console.log('URL là:', API_URL);
    const [user, setUser] = useState(0);
    const [owner, setOwner] = useState(0);
    const [bike, setBike] = useState(0);
    const [successRental, setSuccessRental] = useState(0);
    
    
    useEffect(()=>{
        const fetchData = async ()=>{
            const response2 = await axios.get(`${API_URL}/user/get-owners`)
            const response = await axios.get(`${API_URL}/user/`);
            const response3 = await axios.get(`${API_URL}/bike/get-all-bikes`)
            const response4 = await axios.get(`${API_URL}/rental/`)
            console.log('ham use', response.data);
            setUser(response.data);
            setOwner(response2.data);
            setBike(response3.data);
            setSuccessRental(response4.data.filter(rental => rental.status==="completed").length);
            
        }
        fetchData();
    }, [API_URL])

  return (
    <div className='dashboard'>
        <div>Tổng quan</div>
        <div className='db-overview'>
            <div className='db-card'>
                <div className='db-card-title'>Số khách hàng</div>
                <div className='db-card-value user'>{user.length}</div>
                {/* <div className='db-card-subtitle'>Khách hàng</div> */}
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Số lượng chủ xe</div>
                <div className='db-card-value owner'>{owner.length}</div>
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Tổng số xe</div>
                <div className='db-card-value bike'>{bike.length}</div>
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Số lượt thuê xe</div>
                <div className='db-card-value rental'>{successRental}</div>
            </div>
        </div>
        <div className='db-charts'>
            <div className='db-chart'>Biểu đồ lượng xe</div>
            <div className="chart-card-1">
          <h3>Đơn hàng tháng</h3>
          {/* <ResponsiveContainer width="80%" height={200}>
            <BarChart data={rentalByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" 
                angle={-30} 
                textAnchor="end" 
                interval={0}
                style={{ fontSize: "0.6rem" }}/>
              <YAxis />
              <Tooltip formatter={(value) => [`${value} đơn thuê`, 'Số lượng']}/>
              <Bar dataKey="rentalCount" fill="#82ca9d"  />
            </BarChart>
          </ResponsiveContainer> */}
        </div>
    

        </div>
    </div>
  )
}

export default Dashboard;