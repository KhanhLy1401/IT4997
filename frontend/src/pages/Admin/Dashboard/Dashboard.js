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
    const data = [
        { day: "Mon", new: 42, closed: 10 },
        { day: "Tue", new: 28, closed: 10 },
        { day: "Wed", new: 43, closed: 7 },
        { day: "Thu", new: 34, closed: 10 },
        { day: "Fri", new: 20, closed: 6 },
        { day: "Sat", new: 25, closed: 8 },
        { day: "Sun", new: 22, closed: 12 },
      ];
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
            setSuccessRental(response4.data.filter(rental => rental.status==="Completed").length);
            
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
            {/* <div style={{ width: "100%", height: 300 }}>
      <h3>New vs. Closed</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="closed" fill="#A0AEC0" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="new" stroke="#4A5568" label={{ fill: "white", fontSize: 12 }} />
        </LineChart>
      </ResponsiveContainer> */}


    {/* </div> */}

    <div style={{ width: "100%", height: 400 }}>
      <h3>New vs. Closed</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          
          {/* Biểu đồ cột */}
          <Bar dataKey="closed" fill="#A0AEC0" barSize={30} />

          {/* Biểu đồ đường */}
          <Line 
            type="monotone" 
            dataKey="new" 
            stroke="#4A5568" 
            strokeWidth={2} 
            label={{ position: "top", fill: "white", fontSize: 14 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>

        </div>
    </div>
  )
}

export default Dashboard;