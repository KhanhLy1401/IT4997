import React, { useEffect, useState } from 'react';
import './BikeManagement.css';
import axios from 'axios';

const BikeManagement = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const ownerId = localStorage.getItem('_id');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng xe trên mỗi trang
  const [bikes, setBikes] = useState(null);
  const [activeTab, setActiveTab] = useState('allBikes'); // Thêm state activeTab
  const [selectedStatus, setSelectedStatus] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');



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

  
  // const filteredBikes = bikes?.filter((bike) =>
  //   bike.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
  //   (selectedStatus ? bike.status === selectedStatus : true)
  // );

  const filteredBikes = bikes?.filter((bike) => {
    const titleMatch = bike.title.toLowerCase().includes(titleFilter.toLowerCase());
    const statusMatch = selectedStatus ? bike.status === selectedStatus : true;
    const price = bike?.price?.perDay || 0;
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
    };

    getBikesByOwnerId();
  }, [API_URL, ownerId]);

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
          className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => handleTabClick('statistics')}
        >
          Thống kê
        </button>
        <button
          className={`tab ${activeTab === 'toDoList' ? 'active' : ''}`}
          onClick={() => handleTabClick('toDoList')}
        >
          Danh sách việc cần làm
        </button>
        <button
          className={`tab ${activeTab === 'hiddenBikes' ? 'active' : ''}`}
          onClick={() => handleTabClick('hiddenBikes')}
        >
          Tạm ẩn
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
                  <td>{bike?.price?.perDay} VNĐ</td>
                  <td><span className={`status-label status-${bike.status}`}>{statusLabels[bike.status]}</span></td>
                  <td>{new Date(bike.createdAt).toLocaleDateString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    hour12: false
                  })}</td>
                  <td>
                    <button className="action-btn">Chi tiết</button>
                    <button className='action-hide'>Ẩn xe</button>
                    <button className='action-hide'>Chỉnh sửa</button>
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
              <div class="task-count">0</div>
              <div class="task-label">Chờ Xác Nhận</div>
            </div>
            <div class="task-item">
              <div class="task-count">1</div>
              <div class="task-label">Chờ Lấy Hàng</div>
            </div>
            <div class="task-item">
              <div class="task-count">0</div>
              <div class="task-label">Đã Xử Lý</div>
            </div>
            <div class="task-item">
              <div class="task-count">0</div>
              <div class="task-label">Đơn Hủy</div>
            </div>
            <div class="task-item">
              <div class="task-count">0</div>
              <div class="task-label">Trả Hàng / Hoàn Tiền</div>
            </div>
            <div class="task-item">
              <div class="task-count">13</div>
              <div class="task-label">Sản Phẩm Tạm Khóa</div>
            </div>
            <div class="task-item">
              <div class="task-count">2</div>
              <div class="task-label">Sản Phẩm Hết Hàng</div>
            </div>
            <div class="task-item">
              <div class="task-count">
                0
                <span class="new-badge">New</span>
              </div>
              <div class="task-label">Chương Trình Khuyến Mãi</div>
            </div>
          </div>
        </div>
        <div>
          <h2 className='list-rented-bike'>Danh sách xe đang thuê</h2>

          <table className="bike-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên xe</th>
                <th>Giá thuê/ngày</th>
                <th>Người thuê</th>
                <th>Ngày thuê</th>
                <th>Tổng tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bikes
                ?.filter((bike) => bike.status === 'rented') // chỉ lọc xe đang cho thuê
                .map((bike) => (
                  <tr key={`${bike._id}-todo`}>
                    <td className="product-cell">
                      <img src={bike?.images?.front?.url} alt={bike.title} className="bike-thumb" />
                    </td>
                    <td>{bike.title}</td>
                    <td>{bike?.price?.perDay} VNĐ</td>
                    <td>Ly-0129394939</td>
                    <td>{new Date(bike.createdAt).toLocaleDateString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false
                    })}</td>
                    <td>
                      <button
                        className="action-btn"
                        // onClick={() => handleDelivered(bike._id)}
                      >
                        Đã giao
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
