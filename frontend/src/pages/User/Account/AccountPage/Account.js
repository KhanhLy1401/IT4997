
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
                <h3>Thông tin tài khoản <i className="fa-solid fa-pen"></i></h3>
                <div>
                  <i className="fa-regular fa-suitcase-rolling luggage"> 0</i> chuyến
                </div>
              </div>
              <div className="detail-profile">
                <div className="profile">
                  <div className="avatar-account">Ly</div>
                  <div className="info">
                    <h4>{user?.fullName}</h4>
                    <p>Tham gia: {user?.createdAt}</p>
                  </div>
                </div>
                <div className="details">
                  <p><strong>Ngày sinh:</strong> --/--/----</p>
                  <p><strong>Giới tính:</strong> Nam</p>
                  <p><strong>Email:</strong> {user?.email} </p>
                  <p><strong>Số điện thoại:</strong> {user?.phone} Đã xác thực </p>
                </div>
              </div>
            </section>
    
            <section className="license-info">
              <h3>Giấy phép lái xe {user?.license_status === "pending" ? "Đang chờ xác thực" : (user?.license_status === "verified" ?<span className="verified"> Đã xác thực <i class="fa-solid fa-circle-check"></i></span> : <span className="not-verified">Chưa xác thực</span> ) }</h3>
              <p className="warning">Để đặt xe, bạn cần xác thực GPLX.</p> 
              <div className="license">
                <div className="license-info-img">
                {user?.license_status === "verified" ? <></> : <><i className="fa-regular fa-cloud-arrow-up"></i>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setLicenseImage(e.target.files[0])}
                  /> </> }
            
                  {licenseImage ? (
                    // Nếu người dùng mới upload ảnh, hiển thị ảnh đó từ local
                    <img
                      src={URL.createObjectURL(licenseImage)}
                      alt="GPLX preview"
                      style={{ width: "200px", height: "auto", marginTop: "10px", borderRadius: "8px" }}
                    />
                  ) : user?.license_image_url ? (
                    // Nếu không có ảnh mới, nhưng user đã có ảnh cũ từ server
                    <img
                      src={`${user.license_image_url.url}`}
                      alt="GPLX đã gửi"
                      style={{ width: "200px", height: "auto", marginTop: "10px", borderRadius: "8px" }}
                    />
                  ) : null}
                </div>
                <div className="license-form">
                  <input
                    type="text"
                    placeholder="Nhập số GPLX đã cấp"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Nhập đầy đủ họ tên"
                    value={licenseName}
                    onChange={(e) => setLicenseName(e.target.value)}
                  />
                  <input
                    type="date"
                    placeholder="Ngày sinh"
                    value={licenseDate}
                    onChange={(e) => setLicenseDate(e.target.value)}
                  />
                  {user?.license_status === "verified" ? <></> : <button onClick={handleVerifyLicense}>Xác thực</button>}
                </div>
              </div>
            </section>


            
          </main>
        </div>
      );
    };
    
    export default AccountPage;


