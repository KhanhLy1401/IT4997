import React from 'react'
import axios from 'axios';
import './Dashboard.css'
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend} from "recharts";

const Dashboard = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    // console.log('URL là:', API_URL);
    const [user, setUser] = useState(0);
    const [owner, setOwner] = useState(0);
    const [bike, setBike] = useState(0);
    const [successRental, setSuccessRental] = useState(0);
    const [bikeByProvince, setBikeByProvince] = useState([]);
    const [openProvinces, setOpenProvinces] = useState({});

    const toggleProvince = (province) => {
      setOpenProvinces(prev => ({
        ...prev,
        [province]: !prev[province]
      }));
    };

    
    
    useEffect(()=>{
        const fetchData = async ()=>{
            const response2 = await axios.get(`${API_URL}/user/get-owners`)
            const response = await axios.get(`${API_URL}/user/`);
            const response3 = await axios.get(`${API_URL}/bike/get-all-bikes`)
            const response4 = await axios.get(`${API_URL}/rental/`)
            const response5 = await axios.get(`${API_URL}/bike/count-by-province`);
            setBikeByProvince(response5.data);
            console.log(response3.data);
            setUser(response.data);
            setOwner(response2.data);
            setBike(response3.data);
            setSuccessRental(response4.data.filter(rental => rental.status==="completed").length);
            
        }
        fetchData();
    }, [API_URL])

    const countByType = (bikes) => {
      const result = {};
      bikes.forEach(bike => {
        const type = bike.bikeType || "Không xác định";
        result[type] = (result[type] || 0) + 1;
      });
      return Object.entries(result).map(([type, count]) => ({
        name: type,
        value: count
      }));
    };

    const COLORS = ["#12b76a", "#007bff", "#ffc658", "#ff8042"];

    const PieChartBikeType = ({ bikes }) => {
      const data = countByType(bikes);

      return (
        <div style={{ width: "100%", height: 300 }}>
          <h3>Thống kê loại xe</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>
      );
    };


    const groupBike = bikeByProvince.reduce((acc, item) => {
    const { province, district } = item._id;
    const provinceGroup = acc[province] || { total: 0, districts: [] };

    provinceGroup.total += item.totalBikes;
    provinceGroup.districts.push({
      name: district,
      total: item.totalBikes
    });

    acc[province] = provinceGroup;
    return acc;
  }, {});


  return (
    <div className='dashboard'>
        <div className='report-title'>
          <h2>Tổng quan</h2>
        </div>
        <div className='db-overview'>
            <div className='db-card'>
                <div className='db-card-title'>Số khách hàng</div>
                <div className='db-card-value user'>{user?.length||0}</div>
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Số lượng chủ xe</div>
                <div className='db-card-value owner'>{owner?.length||0}</div>
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Tổng số xe</div>
                <div className='db-card-value bike'>{bike?.length||0}</div>
            </div>
            <div className='db-card'>
                <div className='db-card-title'>Số lượt thuê xe</div>
                <div className='db-card-value rental'>{successRental}</div>
            </div>
        </div>

      <div className='db-pie'>
        <div className='db-table-section'>
        <h3>Thống kê số xe theo Tỉnh/Thành phố</h3>
        <table className='db-table'>
          <thead>
            <tr>
              <th>Tỉnh/Thành phố</th>
              <th>Số lượng xe</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupBike).map(([province, data], index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{province}</td>
                  <td>{data.total}</td>
                  <td>
                    <button onClick={() => toggleProvince(province)}>
                      {openProvinces[province] ? "Ẩn" : "Chi tiết"}
                    </button>
                  </td>
                </tr>
                {openProvinces[province] && data.districts.map((d, i) => (
                  <tr key={i} className="district-row">
                    <td style={{ paddingLeft: "30px" }}> {d.name}</td>
                    <td>{d.total}</td>
                    <td></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>


      <PieChartBikeType bikes={bike} />
      </div>
     
    
    

    </div>
  )
}

export default Dashboard;