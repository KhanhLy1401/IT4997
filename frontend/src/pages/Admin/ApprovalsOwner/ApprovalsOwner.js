import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApprovalsOwner.css';

const ApprovalsOwner = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [approvalOwner, setApprovalOwner] = useState([]); // Thêm useState để lưu danh sách chờ duyệt

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/get-pending-owner`);
                console.log('Dữ liệu nhận được:', response.data.users);
                setApprovalOwner(response.data.users);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách:', error);
            }
        };

        fetchData();
    }, [API_URL]);

    return (
        <div className='approval-owner'>
            <div className='approval-search'>
                <h2>Danh sách duyệt đăng ký chủ xe</h2>
                <input placeholder='Nhập từ khóa cần tìm' /> <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div className='approval-table'>
            <table class="approval-item">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Ảnh đại diện</th>
                        <th>Họ và tên</th>
                        <th>Địa chỉ</th>
                        <th>Xem chi tiết</th>
                        <th>Phê duyệt</th>
                        <th>Từ chối</th>
                    </tr>
                </thead>
                <tbody>
                    {approvalOwner? (
                        approvalOwner.map((user, index) => (
                            <tr>
                                <td>{index+1}</td>
                                <td>{user.avatar_url}</td>
                                <td>{user.fullName}</td>
                                <td>{user.address}</td>
                                <td><i class="fa-solid fa-angle-down"></i></td>
                                <td><i class="fa-solid fa-check"></i></td>
                                <td><i class="fa-solid fa-xmark"></i></td>
                            </tr>
                        ))
                    ) : (
                        <p>Không có yêu cầu nào</p>
                    )}
                    
                </tbody>
                </table>

            </div>


        </div>
    );
};

export default ApprovalsOwner;
