
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all'); // Thêm state lọc role
  const usersPerPage = 8;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/`);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  const blockUser = async (id) => {
    try {
      const confirmBlock = window.confirm("Bạn có chắc chắn muốn chặn người dùng này không?");
      if (!confirmBlock) return;
      await axios.patch(`${API_URL}/user/block-user/${id}`);
      setUsers(prevUsers => prevUsers.map(user =>
        user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
      ));
    } catch (error) {
      console.error("Lỗi khi chặn người dùng:", error.message);
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
      console.error("Lỗi khi mở khóa người dùng:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc theo từ khóa + role
  const filteredUsers = users.filter((user) => {
    const matchSearch = 
      (user.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchRole = selectedRole === 'all' ? true : user.role === selectedRole;

    return matchSearch && matchRole;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="user-management">
      <div className="user-management-title">
        <h2>Quản lý người dùng</h2>

        <div className="user-management-search">
          <input
            type="text"
            className="search-box"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      {/* Tabs lọc role */}
      <div className="role-tabs">
        <button 
          className={selectedRole === 'all' ? 'active' : ''}
          onClick={() => { setSelectedRole('all'); setCurrentPage(1); }}>
          Tất cả
        </button>
        <button 
          className={selectedRole === 'admin' ? 'active' : ''}
          onClick={() => { setSelectedRole('admin'); setCurrentPage(1); }}>
          Admin
        </button>
        <button 
          className={selectedRole === 'owner' ? 'active' : ''}
          onClick={() => { setSelectedRole('owner'); setCurrentPage(1); }}>
          Chủ xe
        </button>
        <button 
          className={selectedRole === 'user' ? 'active' : ''}
          onClick={() => { setSelectedRole('user'); setCurrentPage(1); }}>
          Người dùng
        </button>
      </div>

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
              <td>{user.role==="admin"?"Admin":(user.role==="owner"?"Chủ xe":"Người dùng")}</td>
              <td>{moment(user.createdAt).format("HH:mm:ss DD/MM/YYYY")}</td>
              <td>{user.isBlocked ? "Bị khóa" : "Hoạt động"}</td>
              <td className="manage-actions">
                <i className="angle-down fa-solid fa-angle-down"></i>
                {user.isBlocked ? (
                  <button className="btn approve-btn" onClick={() => unblockUser(user._id)}>
                    <i className="fa-solid fa-unlock-keyhole"></i>
                  </button>
                ) : (
                  <button className="btn block-btn" onClick={() => blockUser(user._id)}>
                    <i className="fa-solid fa-ban"></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>❮</button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => goToPage(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>❯</button>
      </div>
    </div>
  );
};

export default UserManagement;
