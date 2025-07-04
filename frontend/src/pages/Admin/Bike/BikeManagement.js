import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import './BikeManagement.css';

const BikeManagement = () => {
  const [bikes, setBikes] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [expandedBikeId, setExpandedBikeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Lưu giá trị tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const bikesPerPage = 6; // Số xe trên mỗi trang

  // Lấy danh sách xe
  const fetchBikes = async () => {
    try {
      const response = await axios.get(`${API_URL}/bike/get-all-bikes`);
      setBikes(response.data);
      console.log("ds xe", response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xe:", error);
    }
  };

  const toggleDetails = (bikeId) => {
        setExpandedBikeId(expandedBikeId === bikeId ? null : bikeId);
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
    (bike.ownerId?.toLowerCase() || "").includes(searchTerm.toLowerCase())||
    (bike._id?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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
            <th>Hình ảnh</th>
            <th>Tên xe</th>
            <th>Ngày đăng ký</th>
            <th>Số lượt thuê</th>
            <th>Trạng thái</th>
            <th>Quản lý</th>
          </tr>
        </thead>
        <tbody>
          {currentBikes.map((bike, index) => (
            <>
            <tr key={bike._id}>
              <td>{indexOfFirstBike + index + 1}</td>
              <td><img src={bike.images.front.url} />  </td>
              <td><strong>Tên xe: </strong>{bike.title}<br/> <strong>ID:</strong> {bike._id} <br/><strong>OnwerID:</strong>  {bike.ownerId}</td>
              <td>{new Date(bike.createdAt).toLocaleString()}</td>
              <td>{bike.rental_count}</td>
              <td>{bike.isBlocked ? "Bị khóa" : "Hoạt động"}</td>
              <td className="manage-actions">
                <i className="fa-solid fa-angle-down"onClick={()=>toggleDetails(bike._id)}></i>

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
            {expandedBikeId === bike._id && (
                <tr>
                    <td colSpan="7">
                        <div className="detail-approval-info">Thông tin chi tiết</div>
                        
                        <div className='detail-approval-user'>
                            <div className='detail-left'>
                                <img src={bike.images.front.url} alt="Front"  />
                                <img src={bike.images.side.url} alt="Side" />
                                <img src={bike.images.back.url} alt="Back" />

                            </div>
                            <div className='detail-right'>
                                    <div className='detail-right-top'>
                                        <div className="detail-right-item">
                                            <div className="item-approval"><span>Tên xe: {bike.title}</span></div>
                                            <div className="item-approval"><span>Loại xe: {bike.bikeType}</span> </div>
                                            <div className="item-approval"><span>Hãng xe: {bike.brand}</span></div>
                                            <div className="item-approval"><span>Phân khối: {bike.capacity} cm<sup>3</sup></span>  </div>
                                            <div className="item-approval"><span>Đăng ký xe:</span> </div>
                                            <img src={bike.bike_insurance.url} alt="bike_insurance" />
                                        </div>
                                    
                                        <div className="detail-right-item">
                                            
                                            <div className="item-approval"><span>Mô tả: {bike.description}</span></div>
                                            <div className="item-approval"><span>Biển số xe: {bike.license_plate}</span></div>
                                            <div className="item-approval"><span>Địa chỉ xe: {bike.location.province}-{bike.location.district}-{bike.location.ward}</span></div>
                                            <div className="item-approval"><span>Tài sản thế chấp: {bike.security_deposit==="no_deposit"?"Không cần thế chấp":bike.security_deposit}</span></div>
                                            <div className="item-approval"><span>Bảo hiểm xe:</span> </div>
                                            <img src={bike.bike_registration.url} alt="bike_registration" />

                                        </div>
                                    </div>

                                    
                            </div>
                        </div>
                    </td>
                </tr>
            )}
            </>
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
