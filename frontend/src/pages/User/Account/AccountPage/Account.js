
import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Account.css";

const AccountPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseName, setLicenseName] = useState("");
  const [licenseDate, setLicenseDate] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const [_id, setId] = useState("");
  const [user, setUser] = useState(null);

      useEffect(() => {
        const storedId = localStorage.getItem("_id");
          setId(storedId);
      }, []);

      const fetchUsers = async () => {
        try {
          console.log("id:", _id);
          const response = await axios.get(`${API_URL}/user/${_id}`);
          const fetchedUser = response.data;
          console.log("API response:", response.data);

          setUser(fetchedUser);

          if (response.data.license_status === "pending" || response.data.license_status === "verified") {
            setLicenseNumber(response.data.license_number || "");
            setLicenseName(response.data.license_name || "");
            setLicenseDate(response.data.license_date ? response.data.license_date.substring(0, 10) : "");
            setLicenseImage(null); // ảnh sẽ hiển thị qua URL server thay vì local file
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách người dùng:", error);
        }
      };

      useEffect(()=>{
        if (_id) {
          fetchUsers();
        }
      }, [_id])
      const handleVerifyLicense = async () => {
        try {
          if (!licenseNumber || !licenseName || !licenseDate) {
            alert("Vui lòng điền đầy đủ thông tin GPLX.");
            return;
          }
    
          const formData = new FormData();
          formData.append("license_number", licenseNumber);
          formData.append("license_name", licenseName);
          formData.append("license_date", licenseDate);
          formData.append("_id", _id);
          if (licenseImage) {
            formData.append("license_image_url", licenseImage);
          }
    
          const response = await axios.post(`${API_URL}/user/request-license`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
    
          alert("Yêu cầu đã gửi vui lòng chờ !");
          console.log("Server response:", response.data);
        } catch (error) {
          console.error("Lỗi xác thực:", error);
          alert("Xác thực thất bại. Vui lòng thử lại sau.");
        }
      };
      return (
        <div className="account-container">
          <main className="account-content">
            <section className="account-info">
              <div className="account-info-header">
                <h3>Thông tin tài khoản </h3>
              
              </div>
              <div className="detail-profile">
                <div className="profile">
                  <div className="avatar-account"><i class="fa-regular fa-circle-user fa-6x"></i></div>
                  <div className="info">
                    <h4>Họ và tên: {user?.fullName}</h4>
                  </div>
                </div>
                <div className="details">
                  <p><strong>Email:</strong> {user?.email} </p>
                  <p><strong>Số điện thoại:</strong> {user?.phone}  </p>
                  <p><strong>Ngày tham gia: </strong> {new Date(user?.createdAt).toLocaleString('vi-VN')}  </p>
                </div>
              </div>
            </section>
                
          </main>
        </div>
      );
    };
    
    export default AccountPage;


