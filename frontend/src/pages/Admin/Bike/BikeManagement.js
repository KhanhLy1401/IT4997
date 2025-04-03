import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import './BikeManagement.css';

const BikeManagement = () => {
  const [bikes, setBikes] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [searchTerm, setSearchTerm] = useState(""); // Lưu giá trị tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const bikesPerPage = 5; // Số xe trên mỗi trang

  // Lấy danh sách xe
  const fetchBikes = async () => {
    try {
      const response = await axios.get(`${API_URL}/bike/get-all-bikes`);
      setBikes(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xe:", error);
    }
  };

  // Khóa xe
  const blockBike = async (id) => {
    try {
      const confirmBlock = window.confirm("Bạn có chắc chắn muốn khóa xe này không?");
      if (!confirmBlock) return;
      await axios.patch(`${API_URL}/bike/block-bike/${id}`);
      setBikes(prevBikes => prevBikes.map(bike =>
        bike._id === id ? { ...bike, isBlocked: !bike.isBlocked } : bike
      ));
    
    } catch (error) {
      console.error("Lỗi khi khóa xe:", error.message);
    }
  };

  // Mở khóa xe
  const unblockBike = async (id) => {
    try {
      const confirmBlock = window.confirm("Bạn có chắc chắn muốn mở khóa xe này không?");
      if (!confirmBlock) return;
      await axios.patch(`${API_URL}/bike/unblock-bike/${id}`);
      setBikes(prevBikes => prevBikes.map(bike =>
        bike._id === id ? { ...bike, isBlocked: !bike.isBlocked } : bike
      ));
    
    } catch (error) {
      console.error("Lỗi khi mở khóa xe:", error.message);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  // Tìm kiếm xe
  const filteredBikes = bikes.filter((bike) =>
    (bike.model?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (bike.ownerName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastBike = currentPage * bikesPerPage;
  const indexOfFirstBike = indexOfLastBike - bikesPerPage;
  const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);

  const totalPages = Math.ceil(filteredBikes.length / bikesPerPage);

  // Chuyển trang
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bike-management">
      <div className="bike-management-title">
        <h2>Quản lý xe</h2>

        {/* Ô tìm kiếm */}
        <div className="bike-management-search">
          <input
            type="text"
            className="search-box"
            placeholder="Tìm kiếm theo tên xe..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
            }}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      {/* Bảng danh sách xe */}
      <table className="bike-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Model</th>
            
            <th>Tên xe</th>
            <th>Ngày đăng ký</th>
            <th>Trạng thái</th>
            <th>Quản lý</th>
          </tr>
        </thead>
        <tbody>
          {currentBikes.map((bike, index) => (
            <tr key={bike._id}>
              <td>{indexOfFirstBike + index + 1}</td>
              <td><img src={bike.images[0]} /></td>
              <td>{bike.title}</td>
              <td>{moment(bike.registrationDate).format("HH:mm:ss DD/MM/YYYY")}</td>
              <td>{bike.isBlocked ? "Bị khóa" : "Hoạt động"}</td>
              <td className="manage-actions">
                <i className="fa-solid fa-angle-down"></i>

                {bike.isBlocked ? (
                  <button className="btn approve-btn" onClick={() => unblockBike(bike._id)}>
                    <i className="fa-solid fa-circle-check"></i>
                  </button>
                ) : (
                  <button className="btn block-btn" onClick={() => blockBike(bike._id)}>
                    <i className="fa-solid fa-ban"></i>

                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>❮</button>
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} className={currentPage === index + 1 ? "active" : ""} onClick={() => goToPage(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>❯</button>
      </div>
    </div>
  );
};

export default BikeManagement;
