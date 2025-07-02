// Dashboard.js
import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const ownerId = localStorage.getItem("_id");
  const [countBikes, setCountBikes] = useState(0);
  const [countRentals, setCountRentals] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [revenue, setRevenue] = useState(null);
  const [bikeType, setBikeType] = useState(null);
  const [rentalByMonth, setRentalByMonth] = useState(null);
  const [topBike, setTopBike]=useState(null);


  const rentalsByType = [
    { name: "Xe số", value: 35 },
    { name: "Xe tay ga", value: 45 },
  ];


  const COLORS = [ "#00C49F", "#FFBB28"];

  useEffect ( ()=>{
    const countBikes = async () => {
        const response = await axios.get(`${API_URL}/bike/get-by-owner/${ownerId}`);
        setCountBikes(response.data.length);
    }
    const countRentals = async () => {
        const response = await axios.get(`${API_URL}/rental/owner/${ownerId}`);
        console.log("count rental by owner", response.data);
        setCountRentals(response.data.length);
        setTotalRevenue(response.data.reduce((sum, rental) => sum + (rental.totalPrice || 0), 0));
        const uniqueUserIds = new Set(response.data?.map(rental => rental.userId)); 
        setUserCount(uniqueUserIds.size);
    }

    const recentRevenue = async () => {
      const response = await axios.get(`${API_URL}/rental/revenue/${ownerId}`);
      setRevenue(response.data);

    }

    const countBikeType = async () => {
      const response = await axios.get(`${API_URL}/rental/bike-type/${ownerId}`);
      setBikeType(response.data);
    }

    const countRentalByMonth = async () => {
      const response = await axios.get(`${API_URL}/rental/count-by-month/${ownerId}`);
      setRentalByMonth(response.data);
      console.log("rentalbymonth", response.data);
    }

    const getTopBike = async () => {
      const response = await axios.get(`${API_URL}/bike/get-by-owner/${ownerId}`);
      const sorted = response.data.sort((a, b) => b.rental_count - a.rental_count);
      setTopBike(sorted);
    }


    countBikes();
    countRentals();
    recentRevenue();
    countBikeType();
    countRentalByMonth();
    getTopBike();
  },[API_URL]);

  return (
    <div className="dashboard">
      <div className="summary-grid">
          <div  className="summary-card">
            <div className="item-1"><i class="fa-solid fa-motorcycle fa-3x"></i></div>
            <div className="item-2"><span className="highlight-number">{countBikes}</span> <br/>Xe</div>
          </div>

          <div  className="summary-card">
            <div className="item-1"><i class="fa-solid fa-file fa-3x"></i></div>
            <div className="item-2"><span className="highlight-number">{countRentals}</span> <br/>Đơn thuê</div>
          </div>

          <div  className="summary-card">
            <div className="item-1"><i class="fa-solid fa-dollar-sign fa-3x"></i></div>
            <div className="item-2"><span className="highlight-number">{totalRevenue}</span> <br/>VNĐ</div>
          </div>

          <div  className="summary-card">
            <div className="item-1"><i class="fa-solid fa-user fa-3x"></i></div>
            <div className="item-2"><span className="highlight-number">{userCount}</span> <br/>Người thuê</div>
          </div>
      </div>

      <div className="chart-card-1">
          <h3>Đơn hàng tháng</h3>
          <ResponsiveContainer width="80%" height={200}>
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
          </ResponsiveContainer>
        </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Doanh số 6 tháng gần đây</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenue}>
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" activeDot={{ r: 6 }}/>
              <CartesianGrid stroke="#ccc" />
              <XAxis 
                dataKey="month" 
                angle={-30} 
                textAnchor="end" 
                interval={0}
    
                style={{ fontSize: "0.6rem" }}
               />
              <YAxis style={{ fontSize: "0.6rem" }}/>
              <Tooltip formatter={(value) => [`${value} VNĐ`, 'Doanh số']}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Loại xe hay được thuê</h3>
          {rentalsByType.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie dataKey="count" nameKey="bikeType" data={bikeType} outerRadius={80} label>
                  {bikeType?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}

        </div>



        <div className="list-grid">
          <div className="list-card">
            <h3>Xe có lượt thuê nhiều</h3>
            <ul>
              {topBike?.map((bike) => (
                <li key={bike._id}><span>{bike.title}</span><span>{bike.rental_count} lượt thuê</span></li>
              ))}
            </ul>
          </div>

          {/* <div className="list-card">
            <h3>Top Users</h3>
            <ul>
              {topUsers?.map((u) => (
                <li key={u.name}><span>{u.name}</span><span>{u.value}</span></li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
