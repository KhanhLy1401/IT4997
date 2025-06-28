import './Policy.css';

const RentalPolicyPage = () => {
  return (
    <div className="policy-container">
      <h1>Chính Sách & Quy Định</h1>

      <section>
        <h2>1. Trách nhiệm của các bên trong giao dịch cho thuê xe máy</h2>

        <h3>A. Trách nhiệm của Chủ xe</h3>
        <ul>
          <li>Giao xe đúng giờ, tình trạng xe sạch sẽ, an toàn.</li>
          <li>Cung cấp bản photo công chứng giấy tờ xe.</li>
          <li>Chịu trách nhiệm pháp lý về xe.</li>
        </ul>

        <h3>B. Trách nhiệm của Khách thuê xe</h3>
        <ul>
          <li>Kiểm tra và ký biên bản bàn giao xe khi nhận và trả xe.</li>
          <li>Thanh toán tiền thuê, đặt cọc tài sản nếu cần.</li>
          <li>Tuân thủ thời gian, mục đích sử dụng, chịu trách nhiệm khi gây thiệt hại.</li>
        </ul>

        <h3>C. Chính sách hủy chuyến</h3>
        <ul>
          <li>Không cho phép khách thuê hủy chuyến. Chỉ hoàn tiền nếu xe có sự cố hoặc chủ xe không giao đúng như cam kết.</li>
          <li>Mọi yêu cầu hoàn tiền vui lòng liên hệ qua số zalo trên trang web: 0946234129</li>
          <li>Yêu cầu hoàn tiền xử lý muộn nhất tối đa 3 ngày sau khi kết thúc ngày thuê.</li>
        </ul>
      </section>

      <section>
        <h2>2. Chính sách định giá</h2>
        <h3>A. Khách thuê xe</h3>
        <ul>
          <li>Chi phí giao xe nếu có, thỏa thuận với chủ xe.</li>
        </ul>

        <h3>B. Chủ xe</h3>
        <ul>
          <li>Chủ xe tự đặt giá thuê theo ngày.</li>
        </ul>
      </section>

      <section>
        <h2>3. Chính sách thanh toán</h2>
        <ul>
            <li>Khách thuê cần thanh toán 100% trước để giữ chỗ. Xe chỉ được giao khi có xác nhận thanh toán.</li>
            <li>Sau khi thanh toán khách thuê có thể theo dõi tình trạng đơn qua trang web.</li>
            <li>Thanh toán thành công, khách và chủ xe sẽ nhận được email thông báo.</li>
        </ul>
      </section>

      <section>
        <h2>4. Chính sách giao – nhận xe</h2>
        <p>Vui lòng giao nhận xe đúng giờ, nếu trễ giờ quá 30p chuyến sẽ bị hủy.</p>
      </section>

      <section>
        <h2>5. Chính sách kết thúc sớm chuyến đi</h2>
        <p>Không hoàn tiền nếu kết thúc sớm.</p>
      </section>

      <section>
        <h2>6. Vai trò của nền tảng</h2>
        <ul>
          <li>Là trung gian kết nối, không chịu trách nhiệm dân sự nếu phát sinh tranh chấp.</li>
          <li>Hỗ trợ cung cấp thông tin cho cơ quan chức năng nếu có vi phạm.</li>
          <li>Khuyến nghị ký hợp đồng và biên bản bàn giao rõ ràng.</li>
        </ul>
      </section>
    </div>
  );
};

export default RentalPolicyPage;
