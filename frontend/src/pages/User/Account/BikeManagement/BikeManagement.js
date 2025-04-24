import React from 'react';
import './BikeManagement.css';

const BikeManagement = () => {
  const cars = [
    {
      id: 'CAR001',
      name: 'MITSUBISHI XPANDER CROSS 2023',
      quantity: 1,
      revenue: 966000,
      status: 'Đang hoạt động',
      shipper: 'Ninja Van',
      createdAt: '18/04/2025 14:23',
      image: '/images/xpander_cross_2023.jpg'
    },
    {
      id: 'CAR002',
      name: 'MITSUBISHI XPANDER 2024',
      quantity: 1,
      revenue: 787000,
      status: 'Đang hoạt động',
      shipper: 'Ninja Van',
      createdAt: '15/04/2025 10:41',
      image: '/images/xpander_2024.jpg'
    }
  ];

  return (
    <div className="order-management-container">
      <h1>Quản lý xe</h1>
      <div className="tabs">
        <button className="tab active">Tất cả</button>
        <button className="tab">Đang hoạt động</button>
        <button className="tab">Chờ duyệt</button>
        <button className="tab">Tạm ẩn</button>
      </div>
      <div className="filters">
        <input type="text" placeholder="ID Xe" />
        <input type="text" placeholder="Tên xe" />
        <select>
          <option>Đơn vị vận chuyển</option>
        </select>
        <input type="date" />
      </div>
      <table className="car-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Doanh thu</th>
            <th>Trạng thái</th>
            <th>Đơn vị vận chuyển</th>
            <th>Thời gian tạo đơn</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td className="product-cell">
                <img src={car.image} alt={car.name} className="car-thumb" />
                <div>
                  <div>{car.name}</div>
                  <div>x {car.quantity}</div>
                </div>
              </td>
              <td>{car.revenue.toLocaleString('vi-VN')}₫</td>
              <td><span className="status-label">{car.status}</span></td>
              <td>{car.shipper}</td>
              <td>{car.createdAt}</td>
              <td><button className="action-btn">Ẩn xe</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BikeManagement;
