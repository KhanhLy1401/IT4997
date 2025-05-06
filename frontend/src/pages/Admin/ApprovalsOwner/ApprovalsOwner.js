

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApprovalsOwner.css';

const ApprovalsOwner = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [approvalOwner, setApprovalOwner] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Save search term
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const toggleDetails = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/get-pending-owner`);
                setApprovalOwner(response.data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [API_URL]);

    const handleApprove = async (userId) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn duyệt chủ xe này?");
    
        if (!isConfirmed) return;
        try {
            const response = await fetch(`${API_URL}/admin/approve-owner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: userId, action: "approve" }),
            });

            if (response.ok) {
                alert("Approved successfully!");
            } else {
                alert("An error occurred!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error!");
        }
    };

    const handleReject = async (userId) => {
        const isConfirmed = window.confirm("Are you sure you want to reject?");
    
        if (!isConfirmed) return;
        try {
            const response = await fetch(`${API_URL}/admin/approve-owner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: userId, action: "reject" }),
            });
            console.log(response);

            if (response.ok) {
                alert("Từ chối thành công!");
            } else {
                alert("An error occurred!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error!");
        }
    };

    // Filter users based on the search term
    const filteredUsers = approvalOwner.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='approval-owner'>
            <div className='approval-search'>
                <h2>Danh sách duyệt chủ xe</h2>
                <div className='approval-search-bar'>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc địa chỉ"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
            </div>
            <div className='approval-table'>
                <table className="approval-item">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Avatar</th>
                            <th>Full Name</th>
                            <th>Address</th>
                            <th>Details</th>
                            <th>Approve</th>
                            <th>Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <>
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td><img src={user.avatar_url.url} alt="avatar" /></td>
                                        <td>{user.fullName}</td>
                                        <td>{user.address}</td>
                                        <td><i className="fa-solid fa-angle-down" onClick={() => toggleDetails(user._id)}></i></td>
                                        <td><i className="fa-solid fa-check" onClick={() => handleApprove(user._id)}></i></td>
                                        <td><i className="fa-solid fa-xmark" onClick={() => handleReject(user._id)}></i></td>
                                    </tr>

                                    {expandedUserId === user._id && (
                                        <tr>
                                            <td colSpan="7">
                                                <div className="detail-approval-info">Thông tin chi tiết</div>
                                                
                                                <div className='detail-approval-user'>
                                                    <div className='detail-left'>
                                                        <img src={user.avatar_url.url} alt="User"  />
                                                        <img src={user.license_image_url.url} alt="Front" />
                                                        <img src={user.citizen_images.front.url} alt="Front" />
                                                        <img src={user.citizen_images.back.url} alt="Front"  />

                                                    </div>
                                                    <div className='detail-right'>
                                                            <div className='detail-right-top'>
                                                                <div className="detail-right-item">
                                                                    <div className="item-approval">Họ và tên: {user.fullName}</div>
                                                                    <div className="item-approval">Số điện thoại: {user.phone}</div>
                                                                    <div className="item-approval">Email: {user.email}</div>
                                                                    <div className="item-approval">Địa chỉ: {user.address}</div>
                                                                    <div className="item-approval">Số bằng lái xe: {user.license_number}</div>
                                                                </div>
                                                            
                                                                <div className="detail-right-item">
                                                                    
                                                                    <div className="item-approval">Căn cước công dân: {user.citizen_id}</div>
                                                                    <div className="item-approval">Ngân hàng: {user.banking.account_name}</div>
                                                                    <div className="item-approval">Số tài khoản: {user.banking.account_number}</div>
                                                                    <div className="item-approval">Tên chủ tài khoản: {user.banking.account_holder}</div>

                                                                </div>
                                                            </div>

                                                            <div className='btn-approval'>
                                                                <button className='btn-reject'>Từ chối</button>
                                                                <button className='btn-accept'>Chấp nhận</button>
                                                            </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        ) : (
                            <tr><td colSpan="7">No users found</td></tr>
                        )}
                    </tbody>
                </table>

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
        </div>
    );
};

export default ApprovalsOwner;
