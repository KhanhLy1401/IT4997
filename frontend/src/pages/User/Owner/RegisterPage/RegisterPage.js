  import React, {useState, useEffect} from 'react'
  import axios from 'axios';
  import { useNavigate } from "react-router-dom";
  import './RegisterPage.css'
  import AuthModal from '../../../../components/Auth/Auth.js';




  const RegisterPage = ({ isOpen, setIsOpen, isLogin, setIsLogin }) => {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    const [licenseImage, setLicenseImage] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [address, setAddress] = useState('');
    const [citizen_id, setCitizen_id] = useState('');
    const [license_number, setLicense_number] = useState('');
    const [license_image_url, setLicense_image_url] = useState('');
    const [avatar_url, setAvatar_url] = useState('');
    const [citizen_images, setCitizen_images] = useState({ front: "", back: "" });
    const [banking, setBanking] = useState({account_name: "", account_number: "", account_holder:""});

    const handleFrontImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setFrontImage(URL.createObjectURL(file));
          setCitizen_images((prev) => ({ ...prev, front: file }));
      }
  };

    const handleBackImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackImage(URL.createObjectURL(file));
            setCitizen_images((prev) => ({ ...prev, back: file }));
        }
    };

    const handleAvatar = (e) => {
      const file = e.target.files[0];
      if (file) {
        setAvatarImage(URL.createObjectURL(file));   // Lưu file vào state
        setAvatar_url(file);
      }
    };

    const handleLicenseImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setLicenseImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
          setLicense_image_url(file); // Lưu file ảnh vào state
      }
  };
    const [email, setEmail] = useState("");
    const [_id, setId] = useState("");
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("");

    useEffect(() => {
      const storedEmail = localStorage.getItem("user");
      if (storedEmail) {
          setEmail(storedEmail); // Lấy thông tin từ localStorage
      }
      const storedId = localStorage.getItem("_id");
      if (storedId) {
          setId(storedId); // Lấy thông tin từ localStorage
      }
      const storedFullName = localStorage.getItem("fullName");
      if (storedFullName) {
          setFullName(storedFullName); // Lấy thông tin từ localStorage
      }
      const storedPhone = localStorage.getItem("phone");
      if (storedPhone) {
          setPhone(storedPhone); // Lấy thông tin từ localStorage
      }
    }, []);




  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      alert("Bạn cần đồng ý với quy định trước khi tiếp tục!");
      return;
    }

    
    
    const formData = new FormData();
    const bankingData = {

      account_name: banking.account_name,
      account_number: banking.account_number,
      account_holder: banking.account_holder
    };


    formData.append("banking", JSON.stringify(bankingData));
    formData.append("_id", _id);
    formData.append("address", address);
    formData.append("citizen_id", citizen_id);
    formData.append("license_number", license_number);


    // Thêm file ảnh vào formData
    if (avatar_url) formData.append("avatar", avatar_url);
    if (license_image_url) formData.append("license_image", license_image_url);
    if (citizen_images.front) formData.append("citizen_front", citizen_images.front);
    if (citizen_images.back) formData.append("citizen_back", citizen_images.back);
    try {
      const response = await axios.post(`${API_URL}/user/request-owner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      if (response.data.message === "Bạn đã gửi yêu  cầu rồi") {
        alert("Bạn đã gửi yêu cầu rồi. Chờ phê duyệt");
        navigate("/");
        return;
      }
      if (response.data.message === "Bạn đã là chủ xe") {
        alert("Bạn đã là chủ xe");
        navigate("/");
        return;
      }

      alert("Đăng ký thành công!");
    } catch (error) {
      console.log("Đăng ký thất bại", error.message);
      if (error.response) {
        console.log("Server Response:", error.response.data);
      }
    }
  };


    return (
      <div className='register-page'>
        <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} isLogin={isLogin} setIsLogin={setIsLogin} />
        <div className='register-page-img'> <img src="https://images2.thanhnien.vn/Uploaded/ngocthanh/2022_10_09/check-in-9148.jpg"/></div>

        <div className='rp-container'>
          <div className='rp-form'>
    
            <div className='rp-form-title'>Đăng ký làm đối tác</div>
            <div className='rp-form-content'>
                <form onSubmit={handleSubmit}>
                    <div className='content-item'>
                      <div>
                        <label for="name">Tên chủ xe *</label>
                        <input type="text"  value={fullName} readOnly />
                      </div>
                      <div>
                        <label for="phone">Số điện thoại *</label>
                        <input type="tel"  value={phone} readOnly/>
                      </div>
                    </div>
                    <div className='content-item'>
                      <div>
                        <label for="email">Email *</label>
                        <input type="email" value={email} readOnly />

                      </div>
                      <div>
                        <label for="address">Địa chỉ *</label>
                        <input type="text" id="address" name="address" placeholder='Nhập địa chỉ của bạn' value={address} onChange={(e) => setAddress(e.target.value)} required />
                      </div>
                    </div>

                    <div className="cccd-upload">
                      <div>
                        <label>Ảnh mặt trước CCCD *</label>
                        <input type="file" accept="image/*" onChange={handleFrontImageChange} required />
                        {frontImage && <img src={frontImage} alt="CCCD Mặt trước" className="preview-img" />}
                      </div>
                      <div>
                        <label>Ảnh mặt sau CCCD *</label>
                        <input type="file" accept="image/*" onChange={handleBackImageChange} required />
                        {backImage && <img src={backImage} alt="CCCD Mặt sau" className="preview-img" />}
                      </div>
                    </div>

                    <label for="CCCD">Số căn cước công dân *</label>
                    <input type="text" id="CCCD" name="CCCD" placeholder='Nhập số căn cước công dân' value={citizen_id} onChange={(e) => setCitizen_id(e.target.value)} required />

                    <label for="license">Số bằng lái xe *</label>
                    <input type="text" id="license" name="license" placeholder='Nhập số bằng lái xe' value={license_number}  onChange={(e) => setLicense_number(e.target.value)} required />

                  
                    <label for="license_upload">Ảnh bằng lái xe</label>
                    <input type="file" accept="image/*" onChange={handleLicenseImageChange} />
                    {licenseImage && <img src={licenseImage} alt="Ảnh bằng lái xe" className="preview-img" />}

                    
                    <div className='register-avatar'>
                        <label for="avatar">Ảnh cá nhân *</label>
                        <input type="file" id="avatar" name="avatar" accept='image/*' onChange={handleAvatar} required />
                        {avatarImage && <img src={avatarImage} alt = "ảnh cá nhân" className='preview-img'/>}
                    </div>

                    <label>Ngân hàng *</label>
                    <input
                        type="text"
                        id="banking_name"
                        name="banking_name"
                        placeholder="VD: Vietcombank"
                        value={banking.account_name}
                        onChange={(e) => {
                          setBanking({ ...banking, account_name: e.target.value });
                          console.log("Tên ngân hàng cập nhật:", e.target.value);
                        }}
                    />

                    <div className='register-banking'>
                    <label>Số tài khoản ngân hàng *</label>
                    <input
                        type="text"
                        id="banking"
                        name="banking"
                        placeholder="Nhập số tài khoản ngân hàng"
                        value={banking.account_number}
                        onChange={(e) => setBanking({ ...banking, account_number: e.target.value })}
                        required
                    />

                    <label>Tên chủ tài khoản *</label>
                    <input
                        type="text"
                        id="banking_number"
                        name="banking_number"
                        placeholder="VD: Nguyen Van A"
                        value={banking.account_holder}
                        onChange={(e) => setBanking({ ...banking, account_holder: e.target.value })}
                        required
                    />

                    

                    </div>

                    <div className='check-box'>
                      <label >
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => setIsChecked(!isChecked)} 
                        />
                        
                      </label>
                      <div>Tôi đã đọc kỹ và đồng ý với quy định</div>
                    </div>
                    

                    
                    <div className='rp-btn'><button type="submit" className='btn-register'>Đăng Ký</button></div>

                </form>
            </div>
          </div>
          <div className='rp-about'>
            <div className='rp-about-company'>Motorent xin gửi lời chào trân trọng tới các Đối tác,

              Motorent là một nền tảng kết nối các đơn vị cho thuê xe cũng như cá nhân có xe nhàn rỗi với khách hàng cho thuê xe tự lái trên nền tảng trực tuyến và di dộng. Khách hàng có thể dễ dàng tìm kiếm, so sánh giá, thuê xe và thanh toán một cách thuận lợi và tiết kiệm chi phí.</div>
            <div className='rp-advantage'>
                <div className='rp-advantage-title'>Lợi ích khi cộng tác với Motorent</div>
                <ul>
                  <li>Tiếp cận được với một lượng lớn khách hàng có nhu cầu thuê xe tự lái qua nền tảng của ChungXe, là một kênh bán hàng hiệu quả</li>
                  <li>Không mất chi phí quảng cáo và nhân sự để duy trì website, fanpage</li>
                  <li>Không mất chi phí đăng ký và duy trì khi tham gia Chungxe</li>
                  <li>Chỉ tính phí khi có giao dịch thành công (phí hoa hồng)</li>
                  <li>Có công cụ quản lý xe và khách hàng một cách hiệu quả</li>
                  <li>Chủ động trong việc đưa xe, giá, thủ tục lên hệ thống</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default RegisterPage