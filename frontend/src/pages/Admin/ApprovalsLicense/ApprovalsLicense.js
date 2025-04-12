import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApprovalsLicense.css'; // Đảm bảo import đúng file CSS bạn đưa

const ApprovalsLicense = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/admin/get-pending-license`)
      .then(res => setUsers(res.data.users))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const handleApprove = async (id) => {
    await axios.patch(`${API_URL}/admin/approve-license`, { _id: id, action: 'approve' });
    setUsers(prev => prev.filter(user => user._id !== id));
  };

  const handleReject = async (id) => {
    await axios.patch(`${API_URL}/admin/approve-license`, { _id: id, action: 'reject' });
    setUsers(prev => prev.filter(user => user._id !== id));
  };

  console.log(`${API_URL}/admin/approve-license`);

// console.log('Type of users:', typeof users);


  const filteredUsers = users.filter(user =>
    user.license_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="approval-search">
        <h2>Duyệt giấy phép lái xe</h2>
        <div className="approval-search-bar">
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="approval-table approval-item">
        <thead>
          <tr>
            <th>#</th>
            <th>Ảnh GPLX</th>
            <th>Họ tên</th>
            <th>Số GPLX</th>
            <th>Ngày cấp</th>
            <th>Duyệt</th>
            <th>Từ chối</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr><td colSpan="7">Không có yêu cầu nào chờ duyệt.</td></tr>
          ) : (
            filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td><img src={user.license_image_url} alt="GPLX" /></td>
                <td>{user.license_name}</td>
                <td>{user.license_number}</td>
                <td>{user.license_date?.substring(0, 10)}</td>
                <td>
                  <i onClick={() => handleApprove(user._id)} className="fa fa-check"></i>
                </td>
                <td>
                  <i onClick={() => handleReject(user._id)} className="fa fa-times"></i>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalsLicense;
