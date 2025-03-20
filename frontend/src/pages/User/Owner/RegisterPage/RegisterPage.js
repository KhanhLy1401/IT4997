import React from 'react'
import './RegisterPage.css'

const RegisterPage = () => {
  return (
    <div className='register-page'>
      <div className='rp-container'>
        <div className='rp-form'>
          <div className='rp-form-title'>Đăng ký làm đối tác</div>
          <div className='rp-form-content'>
              <form>
                  <label for="name">Tên đơn vị/chủ xe *</label>
                  <input type="text" id="name" name="name" placeholder="Nhập tên đơn vị/chủ xe..." required/>

                  <label for="phone">Số điện thoại *</label>
                  <input type="tel" id="phone" name="phone" placeholder="Nhập số điện thoại..." required/>

                  <label for="email">Email *</label>
                  <input type="email" id="email" name="email" placeholder="Nhập email..." required />

                  <button type="submit">Đăng Ký</button>
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