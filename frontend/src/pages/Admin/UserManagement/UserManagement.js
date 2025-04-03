
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [searchTerm, setSearchTerm] = useState(""); // Lưu giá trị tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const usersPerPage = 5; // Số người dùng trên mỗi trang

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/`);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  // Xóa người dùng
  const blockUser = async (id) => {
    try {
      const confirmBlock = window.confirm("Bạn có chắc chắn muốn chặn người dùng này không?");
      if (!confirmBlock) return;
      await axios.patch(`${API_URL}/user/block-user/${id}`);
      setUsers(prevUsers => prevUsers.map(user =>
        user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
      ));
    
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error.message);
    }
  };

  const unblockUser = async (id) => {
    try {
      const confirmBlock = window.confirm("Bạn có chắc chắn muốn mở khóa người dùng này không?");
      if (!confirmBlock) return;
      await axios.patch(`${API_URL}/user/unblock-user/${id}`);
      setUsers(prevUsers => prevUsers.map(user =>
        user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
      ));
    
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tìm kiếm người dùng theo tên
  const filteredUsers = users.filter((user) =>
    (user.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (user.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Chuyển trang
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="user-management">
      <div className="user-management-title">
        <h2>Quản lý người dùng</h2>

        {/* Ô tìm kiếm */}
        <div className="user-management-search">
        <input
            type="text"
            className="search-box"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
            }}
        />
        <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      

      {/* Bảng danh sách người dùng */}
      <table className="user-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Quản lý</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{indexOfFirstUser + index + 1}</td>
              <td className="user-info">
                <strong>{user.fullName}</strong>
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>{moment(user.createdAt).format("HH:mm:ss DD/MM/YYYY")}</td>
              <td>{user.isBlocked?"Bị khóa":"Hoạt động "}</td>
              <td className="manage-actions">
                {user.isBlocked ? <button className="btn approve-btn" onClick={() => unblockUser(user._id)}>
                  <i class="fa-solid fa-unlock-keyhole"></i>
                </button> : <button className="btn block-btn" onClick={() => blockUser(user._id)}>
                  <i className="fa-solid fa-ban"></i>
                </button>}
                
                
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

export default UserManagement;
