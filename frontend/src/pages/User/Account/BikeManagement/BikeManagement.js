import React, { useEffect, useState } from 'react';
import './BikeManagement.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BikeManagement = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const ownerId = localStorage.getItem('_id');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng xe trên mỗi trang
  const [bikes, setBikes] = useState(null);
  const [confirmedBikes, setConfirmedBikes] = useState(null);
  const [activeTab, setActiveTab] = useState('allBikes'); // Thêm state activeTab
  const [selectedStatus, setSelectedStatus] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();




  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginationNumbers = (totalPages, currentPage) => {
    const pages = [];
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, '...' , totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
  
    return pages;
  };


  const statusLabels = {
    pending_approval: 'Chờ duyệt',
    available: 'Sẵn',
    rented: 'Đang thuê',
    locked: 'Đã khóa',
  };

  

  const filteredBikes = bikes?.filter((bike) => {
    const titleMatch = bike.title.toLowerCase().includes(titleFilter.toLowerCase());
    const statusMatch = selectedStatus ? bike.status === selectedStatus : true;
    const price = bike?.price || 0;
    const min = minPrice ? parseInt(minPrice) : 0;
    const max = maxPrice ? parseInt(maxPrice) : Infinity;
    const priceMatch = price >= min && price <= max;
    return titleMatch && statusMatch && priceMatch;
  });
  


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = filteredBikes ? Math.ceil(filteredBikes.length / itemsPerPage) : 0;
  const currentBikes = filteredBikes?.slice(indexOfFirstItem, indexOfLastItem);



  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page when switching tabs
  };

  const resetFilters = () => {
    setTitleFilter('');
    setSelectedStatus('');
    setMinPrice('');
    setMaxPrice('');
  };
  

  useEffect(() => {
    const getBikesByOwnerId = async () => {
      const response = await axios.get(`${API_URL}/bike/get-by-owner/${ownerId}`);
      setBikes(response.data);
      console.log(response.data);
    };

    const getConfirmedBikes = async () => {
      const response = await axios.get(`${API_URL}/rental/owner/${ownerId}`);
      setConfirmedBikes(response.data);
      console.log('confirmed-bike', response.data);
      
    }

    getBikesByOwnerId();
    getConfirmedBikes();
  }, [API_URL, ownerId]);

  const handleDelivered = async (bikeId) => {
    try {
      setLoading(true); // Bắt đầu loading
      setMessage("");   // Clear message cũ
  
      await axios.patch(`${API_URL}/rental/update-status/${bikeId}`, {
        status: "in_progress"
      });
  
      setMessage("Giao xe thành công!"); // ✅
  
      // Reload lại danh sách
      const response = await axios.get(`${API_URL}/rental/owner/${ownerId}`);
      setConfirmedBikes(response.data);
    } catch (error) {
      console.log("Lỗi xác nhận giao xe:", error.message);
      setMessage("Có lỗi xảy ra, vui lòng thử lại."); // ❌
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };
  

  const handleCompleted = async (bikeId) => {
    try {
      setLoading(true); // Bắt đầu loading
      setMessage("");   // Clear message cũ
  
      await axios.patch(`${API_URL}/rental/update-status/${bikeId}`, {
        status: "completed"
      });
  
      setMessage("Hoàn thành chuyến!"); // ✅
  
      // Reload lại danh sách
      const response = await axios.get(`${API_URL}/rental/owner/${ownerId}`);
      setConfirmedBikes(response.data);
    } catch (error) {
      console.log("Lỗi xác nhận hoàn thành chuyến:", error.message);
      setMessage("Có lỗi xảy ra, vui lòng thử lại."); // ❌
    } finally {
      setLoading(false); // Kết thúc loading
    }
  }
  return (
    <div className="order-management-container">
      <h1>Quản lý xe</h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'allBikes' ? 'active' : ''}`}
          onClick={() => handleTabClick('allBikes')}
        >
          Tất cả xe
        </button>
        <button
          className={`tab ${activeTab === 'toDoList' ? 'active' : ''}`}
          onClick={() => handleTabClick('toDoList')}
        >
          Danh sách việc cần làm
        </button>
      </div>

      {/* Nội dung hiển thị cho tab "Tất cả xe" */}
      {activeTab === 'allBikes' && (
        <>
          <div className="filters">
            <input
              type="text"
              placeholder="Tên xe"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />

            {/* <input type="text" placeholder="Tên xe" /> */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`status-${selectedStatus || 'all'}`}
            >
              <option value="">Tất cả trạng thái</option>
              <option className='status-pending_approval' value="pending_approval">Chờ duyệt</option>
              <option className='status-available'value="available">Sẵn</option>
              <option className='status-rented' value="rented">Đang thuê</option>
              <option className='status-locked' value="locked">Đã khóa</option>
            </select>

            <input
              type="number"
              placeholder="Giá thuê từ"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              step="5000"
            />
            <input
              type="number"
              placeholder="Đến"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              step="5000"
            />
            <i className="fa-solid fa-rotate-right repeat-btn" onClick={resetFilters}></i>
          </div>

          <table className="bike-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên xe</th>
                <th>Giá thuê/ngày</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentBikes?.map((bike) => (
                <tr key={`${bike._id}-${bike.createdAt}`}>
                  <td className="product-cell">
                    <img src={bike?.images?.front?.url} alt={bike.name} className="bike-thumb" />
                  </td>
                  <td>{bike.title}</td>
                  <td className='price'>{bike?.price} VNĐ</td>
                  <td><span className={`status-label status-${bike.status}`}>{statusLabels[bike.status]}</span></td>
                  <td>{new Date(bike.createdAt).toLocaleDateString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    hour12: false
                  })}</td>
                  <td>
                    <button className="action-btn" onClick={() => navigate(`/account/bikes/${bike._id}`, { state: { bike } })}>Chi tiết</button>
                    <button className='action-hide'>Khóa xe</button>
                    <button className='action-fix'>Chỉnh sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {getPaginationNumbers(totalPages, currentPage).map((page, index) =>
              page === '...' ? (
                <span key={index} className="dots">...</span>
              ) : (
                <button
                  key={`page-${page}-${index}`}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </>
      )}

      {/* Nội dung hiển thị cho tab "Thống kê" */}
      {activeTab === 'statistics' && (
        <div className="statistics-tab">
          <h2>Thống kê xe</h2>
          {/* Thêm nội dung thống kê tại đây */}
        </div>
      )}

      {/* Các tab khác */}
      {activeTab === 'toDoList' && <div>
          <div>
            <div class="task-list">
            <div class="task-item">
              <div class="task-count">{confirmedBikes
                ?.filter((bike) => bike.status === 'confirmed').length}</div>
              <div class="task-label">Chờ Giao Xe</div>
            </div>
            <div class="task-item">
              <div class="task-count">{confirmedBikes
                ?.filter((bike) => bike.status === 'in_progress').length}</div>
              <div class="task-label">Xe đang được thuê</div>
            </div>
            <div class="task-item">
              <div class="task-count">{confirmedBikes
                ?.filter((bike) => bike.status === 'completed').length}</div>
              <div class="task-label">Số xe hoàn thành</div>
            </div>
            <div class="task-item">
              <div class="task-count">{confirmedBikes
                ?.filter((bike) => bike.status === 'cancelled').length}</div>
              <div class="task-label">Xe bị hủy</div>
            </div>
            <div class="task-item">
              <div class="task-count">0</div>
              <div class="task-label">Xe tạm bị khóa</div>
            </div>
            <div class="task-item">
              <div class="task-count">13</div>
              <div class="task-label">Số lượt đánh giá</div>
            </div>
            <div class="task-item">
              <div class="task-count">2</div>
              <div class="task-label">Số bình luận</div>
            </div>
            <div class="task-item">
              <div class="task-count">
                0
                <span class="new-badge">New</span>
              </div>
              <div class="task-label">Tổng số đơn</div>
            </div>
          </div>
        </div>
        <div>
          <h2 className='list-rented-bike'>Danh sách xe cần giao</h2>

          <table className="bike-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                {/* <th>Tên xe</th>
                <th>Người thuê</th> */}
                <th>Ngày thuê</th>
                <th>Tổng tiền</th>
                <th>Xác nhận</th>
              </tr>
            </thead>
            <tbody>
              {confirmedBikes
                ?.filter((bike) => bike.status === 'confirmed') // chỉ lọc xe đang cho thuê
                .map((bike) => (
                  <tr key={`${bike._id}-todo`}>
                    <td className="product-cell">
                      <img src={bike?.bikeImage} alt={bike.title} className="bike-thumb" />
                    </td>
                    {/* <td>{bike.title}</td>
                    <td>{bike?.totalPrice}</td> */}
                    <td>
                      {bike.startTime} {new Date(bike.startDate).toLocaleDateString('vi-VN')} -
                      {bike.endTime} {new Date(bike.endDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className='price'>
                      {bike.totalPrice} VNĐ
                    </td>
          
                    <td>
                    <button
                      className="action-btn"
                      onClick={() => {
                        const isConfirmed = window.confirm("Bạn có chắc chắn đã giao xe này?");
                        if (isConfirmed) {
                          handleDelivered(bike._id);
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? "Đang xử lý..." : "Đã giao"}
                    </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h2 className='list-rented-bike'>Danh sách xe đang cho thuê</h2>
          <table className="bike-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                {/* <th>Tên xe</th>
                <th>Người thuê</th> */}
                <th>Ngày thuê</th>
                <th>Tổng tiền</th>
                <th>Xác nhận</th>
              </tr>
            </thead>
            <tbody>
              {confirmedBikes
                ?.filter((bike) => bike.status === 'in_progress') // chỉ lọc xe đang cho thuê
                .map((bike) => (
                  <tr key={`${bike._id}-todo`}>
                    <td className="product-cell">
                      <img src={bike?.bikeImage} alt={bike.title} className="bike-thumb" />
                    </td>
                    {/* <td>{bike.title}</td>
                    <td>{bike?.totalPrice}</td> */}
                    <td>
                      {new Date(bike.startDate).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false
                      })}-
                      {new Date(bike.endDate).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false
                      })}
                    </td>
                    <td className='price'>
                      {bike.totalPrice} VNĐ
                    </td>
                  
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleCompleted(bike._id)}
                      >
                        Xác nhận hoàn thành
                      </button>

                    </td>
                  </tr>
                ))}
            </tbody>
          </table>


          <h2 className='list-rented-bike'>Danh sách xe đã hoàn thành</h2>
          <table className="bike-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                {/* <th>Tên xe</th> */}
                {/* <th>Người thuê</th> */}
                <th>Ngày thuê</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {confirmedBikes
                ?.filter((bike) => bike.status === 'completed') // chỉ lọc xe đang cho thuê
                .map((bike) => (
                  <tr key={`${bike._id}-todo`}>
                    <td className="product-cell">
                      <img src={bike?.bikeImage} alt={bike.title} className="bike-thumb" />
                    </td>
                    {/* <td>{bike.title}</td> */}
                    {/* <td>{bike?.totalPrice}</td> */}
                    <td>
                      {new Date(bike.startDate).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false
                      })}-
                      {new Date(bike.endDate).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false
                      })}
                    </td>
                    <td className='price'>
                      {bike.totalPrice} VNĐ
                    </td>
                   
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleCompleted(bike._id)}
                      >
                        Xem đánh giá
                      </button>

                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>}
      {activeTab === 'hiddenBikes' && <div>Tab tạm ẩn</div>}
    </div>
  );
};

export default BikeManagement;
