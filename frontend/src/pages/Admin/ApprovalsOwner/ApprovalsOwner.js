import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApprovalsOwner.css';

const ApprovalsOwner = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [approvalOwner, setApprovalOwner] = useState([]); // Thêm useState để lưu danh sách chờ duyệt
    const [expandedUserId, setExpandedUserId] = useState(null);

    const toggleDetails = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

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

    const handleApprove = async (userId) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn chấp nhận không?");
    
        if (!isConfirmed) return; 
        try {
            const response = await fetch(`${API_URL}/admin/approve-owner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: userId,
                    action: "approve",
                }),
            });
    
            if (response.ok) {
                alert("Chấp nhận thành công!");
                // Xử lý UI sau khi approve (có thể setState để cập nhật danh sách)
            } else {
                alert("Có lỗi xảy ra!");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Lỗi kết nối đến server!");
        }
    };

    const handleReject = async (userId) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn từ chối không?");
    
        if (!isConfirmed) return; 
        try {
            const response = await fetch(`${API_URL}/admin/approve-owner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: userId,
                    action: "reject",
                }),
            });
    
            if (response.ok) {
                alert("Từ chối thành công!");
                // Xử lý UI sau khi approve (có thể setState để cập nhật danh sách)
            } else {
                alert("Có lỗi xảy ra!");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Lỗi kết nối đến server!");
        }
    };


    return (
        <div className='approval-owner'>
            <div className='approval-search'>
                <h2>Danh sách duyệt đăng ký chủ xe</h2>
                <div className='approval-search-bar'><input placeholder='Nhập từ khóa cần tìm' /> <i class="fa-solid fa-magnifying-glass"></i></div>
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
                        approvalOwner.map((user, index) => (<>
                        <tr>
                                <td>{index+1}</td>
                                <td><img src={user.avatar_url} alt="avatar"/></td>
                                <td>{user.fullName}</td>
                                <td>{user.address}</td>
                                <td><i class="fa-solid fa-angle-down" onClick={() => toggleDetails(user._id)}  >
                                    </i></td>
                                <td><i class="fa-solid fa-check" onClick={()=>{handleApprove(user._id)}}></i></td>
                                <td><i class="fa-solid fa-xmark" onClick={()=>{handleReject(user._id)}}></i></td>
                            </tr>
                            
                            {expandedUserId === user._id && (
                                <tr key={user._id}>
                                  <td colSpan="7">
                                    <div className='detail-approval-info'>Thông tin chi tiết</div>
                                    <div className='detail-approval-user'>
                                        <div className='detail-top'>
                                            <div className='detail-left'>
                                                <div className='detail-left-avatar'>
                                                    <img src={user.avatar_url} alt="User" width=" 300px" />
                                                </div>
                                            </div>
                                            <div className='detail-right'>
                                                <div className='detail-right-item'>
                                                    <div className='item-approval'>Họ và tên : {user.fullName}</div>
                                                    <div className='item-approval'>Số điện thoại : {user.phone}</div>
                                                    <div className='item-approval'>Email : {user.email}</div>
                                                </div>
                                                <div className='detail-right-item'>
                                                    <div className='item-approval'>Địa chỉ: {user.address}</div>
                                                </div>
                                                <div className='detail-right-item'>
                                                    <div className='item-approval'>Số bằng lái xe: {user.license_number}</div>
                                                    <div className='item-approval'>Số CCCD: {user.citizen_id}</div>
                                                </div>
                                                <div className='detail-right-item'>
                                                    <div className='item-approval'>Ngân hàng: {user.banking.account_name}</div>
                                                    <div className='item-approval'>Số tài khoản: {user.banking.account_number}</div>
                                                    <div className='item-approval'>Chủ tài khoản: {user.banking.account_name}</div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='detail-line'></div>
                                        <div className='detail-bottom'>
                                            <div className='detail-bottom-item'>
                                                <img src={user.citizen_images.front} alt="Front" width="300"  />
                                            </div>
                                            <div className='detail-bottom-item'>
                                                <img src={user.citizen_images.front} alt="Front" width="300"  />
                                            </div>
                                            <div className='detail-bottom-item'>
                                                <img src={user.citizen_images.front} alt="Front" width="300"  />
                                            </div>
                                        </div>
                                        
                                      {/* <div className='detail-approval-item'>
                                        <img src={user.avatar_url} alt="User" width="200px" />
                                        <p>{user.fullName}</p>
                                        <p>{user.phone}</p>
                                        <p>{user.email}</p>
                                      </div>
                                      <div className='detail-approval-item'>
                                        <div className='license-img'><img src={user.license_image_url} alt="License"/> </div>

                                        <p>{user.fullName}</p>
                                        <p>{user.phone}</p>
                                        <p>{user.email}</p>
                                      </div>

                                      <div className='detail-approval-item'>
                                        <div className='citizen_img_back'>
                                            <img src={user.citizen_images.back} alt="Back" width="80" />
                                        </div>
                                        <div className='address'>Địa chỉ: {user.address}</div>
                                        <div className='license-number'>Số bằng lái: {user.license_number}</div>
                                        <div className='account_name'>Chủ tài khoản: {user.banking.account_name}</div>
                                        <div className='account_number'>STK: {user.banking.account_number}</div>
                                        <div className='account_holder'>Ngân hàng: {user.banking.account_holder}</div>
                                      </div>

                                      <div className='detail-approval-item'>
                                          <div className='citizen_number'>CCCD: {user.citizen_id}<div />
                                          <div  className='citizen_img_front'>
                                            <img src={user.citizen_images.front} alt="Front" width="80"  />
                                          </div>
                                          
                                      </div> */}
                                     
                                    </div>
                                    <div ></div>
                                  </td>
                                </tr>
                              )}
                        </>
                            
                           

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
