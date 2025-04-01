import React from "react";
import './Footer.css'
import '../../fontawesome/css/all.min.css'

function Footer () {
    return (
        <div className="footer">
            
            <div className="footer-container">

                <div className="main-content">
                    <div className="footer-about">
                    <div className="logo">
                        <img src='../../../logo.png' alt='logo' />
                        <div className='title-footer'>MOTORENT</div>
                    </div>
                    <div className="contact">
                        <div className="contact-phone">0946234129</div>
                        <div className="contact-time">Thời gian hỗ trợ: 7AM - 10PM</div>
                    </div>
                    <div className="contact-email">
                        <div className="email">motorent@gmail.com</div>
                        <div>Gửi mail cho Motorent</div>
                    </div>
                </div>

                    <div className="footer-policy">
                        <h2><i class="fa-solid fa-building-shield"></i> Chính sách</h2>
                            <div>Chính sách và quy định</div>
                            <div>Quy chế hoạt động</div>
                            <div>Bảo mật thông tin</div>
                            <div>Giải quyết tranh chấp</div>
                    </div>

                    <div className="learn-more">
                        <h2><i class="fa-solid fa-landmark-magnifying-glass"></i>Tìm hiểu thêm</h2>
                            <div>Hướng dẫn chung</div>
                            <div>Hướng đặt xe</div>
                            <div>Hướng thanh toán</div>
                            <div>Hỏi và trả lời</div>
                    </div>

                    <div className="policy-partner">
                        <h2> <i class="fa-solid fa-handshake"></i>Đối tác</h2>
                        <div>Đăng ký trở thành đối tác</div>
                    </div>
                </div>
                <div className="line-footer"></div>
                <div className="footer-banking">
                    <div className="footer-address"><i class="fa-solid fa-location-dot"></i> Địa chỉ: Nhà 18, ngõ 105 Yên Hòa, quận Cầu Giấy, Thành phố Hà Nội</div>
                    <div className="banking">
                        <div className="banking-item"><i class="fa-solid fa-user-tie"></i> Tên chủ TK: momooooo</div>
                        <div className="banking-item"><i class="fa-solid fa-credit-card"></i> Số TK: 12345687789</div>
                        <div className="banking-item"><i class="fa-solid fa-building-columns"></i> Ngân hàng: Vietcombank</div>
                    </div>
                </div>
            </div>
    </div>
    );
   
}

export default Footer;