import { useState, useEffect } from 'react';
import axios from 'axios';
import './ApprovalsBike.css'

const ApprovalsBike = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [approvalBike, setApprovalBike] = useState([]);
    const [expandedBikeId, setExpandedBikeId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Save search term
    const [currentPage, setCurrentPage] = useState(1);
    const bikesPerPage = 8;

    const toggleDetails = (bikeId) => {
        setExpandedBikeId(expandedBikeId === bikeId ? null : bikeId);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/get-pending-bike`);
                console.log("lyy", response.data);
                setApprovalBike(response.data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [API_URL]);

    const handleApprove = async (bikeId) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn duyệt xe này?");
    
        if (!isConfirmed) return;
        try {
            const response = await fetch(`${API_URL}/admin/approve-bike`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: bikeId, action: "approve" }),
            });

            if (response.ok) {
                 alert("Chấp nhận xe thành công!");
                // Loại bỏ xe đã duyệt khỏi danh sách
                setApprovalBike((prev) => prev.filter(bike => bike._id !== bikeId));
            } else {
                alert("Có lỗi!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error!");
        }
    };

    const handleReject = async (bikeId) => {
        const isConfirmed = window.confirm("Are you sure you want to reject?");
    
        if (!isConfirmed) return;
        try {
            const response = await fetch(`${API_URL}/admin/approve-owner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: bikeId, action: "reject" }),
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

    const filteredBikes = approvalBike?.filter(bike =>
        bike.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        bike.location.provice?.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    const indexOfLastBike = currentPage * bikesPerPage;
    const indexOfFirstBike = indexOfLastBike - bikesPerPage;
    const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);
  
    const totalPages = Math.ceil(filteredBikes.length / bikesPerPage);
  
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
  return (
     <div className='approval-owner'>
            <div className='approval-search'>
                <h2>Danh sách duyệt xe</h2>
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
                            <th>Xe</th>
                            <th>Tên xe</th>
                            <th>Địa chỉ</th>
                            <th>Chi tiết</th>
                            <th>Chấp nhận</th>
                            <th>Từ chối</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBikes.length > 0 ? (
                            currentBikes.map((bike, index) => (
                                <>
                                    <tr key={bike._id}>
                                        <td>{index + 1}</td>
                                        <td><img src={bike.images.front.url} alt="image" /></td>
                                        <td>{bike.title}</td>
                                        <td>{bike.location.province}</td>
                                        <td><i className="fa-solid fa-angle-down" onClick={() => toggleDetails(bike._id)}></i></td>
                                        <td><i className="fa-solid fa-check" onClick={() => handleApprove(bike._id)}></i></td>
                                        <td><i className="fa-solid fa-xmark" onClick={() => handleReject(bike._id)}></i></td>
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
                            ))
                        ) : (
                            <tr><td colSpan="7">No Bikes found</td></tr>
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
  )
}

export default ApprovalsBike;


