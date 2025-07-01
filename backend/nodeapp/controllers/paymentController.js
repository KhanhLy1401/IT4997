import crypto from 'crypto';
import axios from 'axios';
import Payment from '../models/Payment.js';
import Rental from '../models/Rental.js';
import User from '../models/User.js';
import Bike from '../models/Bike.js';
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khanhlypt14@gmail.com',
    pass: process.env.MAIL_PASS,  
  },

})

transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter Error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});



const IPN_URL= process.env.IPN_URL;
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const redirectUrl = 'https://rental-motorbike-web.onrender.com/account/my-bookings';

const ipnUrl = `${IPN_URL}/payment/ipn`;
const requestType = "payWithMethod";
const lang = 'vi';



// export const sendPaymentSuccessEmail = async (toEmail, customerName, phone, bikeName) => {
//   const mailOptions = {
//     from: '"Motorent" <khanhlypt14@gmail.com>',
//     to: toEmail,
//     subject: 'Thông báo: Xe của bạn đã được thuê',
//     html: `
//       <h3>Xin chào!</h3>
//       <p>Xe ${bikeName} của bạn đã được thuê bởi ${customerName} </p>
//       <p>Thanh toán đã hoàn tất. Vui lòng chuẩn bị xe sẵn sàng liên hệ sdt: ${phone}.</p>
//     `
//   };

//   await transporter.sendMail(mailOptions);
// };

export const sendPaymentSuccessEmail = async (
  ownerEmail,
  renterEmail,
  ownerName,
  renterName,
  renterPhone,
  bikeName
) => {
  const ownerMailOptions = {
    from: '"Motorent" <khanhlypt14@gmail.com>',
    to: ownerEmail,
    subject: 'Thông báo: Xe của bạn đã được thuê',
    html: `
      <h3>Xin chào ${ownerName}!</h3>
      <p>Xe <strong>${bikeName}</strong> của bạn đã được thuê bởi <strong>${renterName}</strong>.</p>
      <p>Thanh toán đã hoàn tất. Vui lòng chuẩn bị xe sẵn sàng và liên hệ SĐT: <strong>${renterPhone}</strong>.</p>
    `
  };

  const renterMailOptions = {
    from: '"Motorent" <khanhlypt14@gmail.com>',
    to: renterEmail,
    subject: 'Thông báo: Đặt xe thành công',
    html: `
      <h3>Xin chào ${renterName}!</h3>
      <p>Bạn đã đặt thành công xe <strong>${bikeName}</strong> của <strong>${ownerName}</strong>.</p>
      <p>Chủ xe sẽ sớm liên hệ với bạn qua số điện thoại: <strong>${renterPhone}</strong>.</p>
      <p>Chúc bạn có trải nghiệm tốt!</p>
    `
  };

  await transporter.sendMail(ownerMailOptions);
  await transporter.sendMail(renterMailOptions);
};


export const createPayment = async (req, res) => {
  const { amount, orderId, orderInfo, rentalId,  } = req.body;
  const requestId = orderId;
  const extraData = '';
  const expiryTime = Date.now() + 600 * 1000; // 600 giây = 10 phút

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const requestBody = JSON.stringify({
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture: true,
    extraData,
    signature,
  });

  try {
    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    const payUrl = response.data.payUrl;

    // ✅ Lưu thông tin thanh toán vào DB
    await Payment.create({
      paymentId: requestId,
      rentalId: rentalId,
      totalPrice: amount,
      method: 'MoMo',
      status: 'pending'
    });

    return res.json({ payUrl });
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ message: 'Failed to create payment' });
  }
};

export const handleIPN = async (req, res) => {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;
  
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  
    const generatedSignature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    if (generatedSignature !== signature) {
      console.log(' Signature mismatch. Possible fraud.');
      return res.status(400).json({ message: 'Invalid signature' });
    }
  
    console.log(" Đang lưu Payment với paymentId:", requestId);

    
    // Check if transaction is successful
    if (resultCode === 0) {
      // Cập nhật đơn hàng thành công ở DB
      console.log(` Giao dịch thành công cho đơn hàng ${requestId}`);

      try {
        // 1. Tìm payment theo orderId
        const payment = await Payment.findOne({ paymentId: orderId });
    
        if (!payment) {
          console.log("❌ Không tìm thấy thông tin thanh toán.");
          return res.status(404).json({ message: 'Payment not found' });
        }
    
        // 2. Cập nhật trạng thái thanh toán
        payment.status = 'complete';
        await payment.save();
    
        // 3. Cập nhật trạng thái đơn thuê
;

        await Rental.findByIdAndUpdate(payment.rentalId, {
          status: 'confirmed',
          paymentStatus: 'paid',
        });

        const rental = await Rental.findById(payment.rentalId);
        const renter = await User.findById(rental.userId);
        const bike = await Bike.findById(rental.bikeId);
        const owner = await User.findById(bike.ownerId);

        if (!renter || !owner) {
          console.log("❌ Không tìm thấy người thuê hoặc chủ xe.");
          return res.status(404).json({ message: 'User or owner not found' });
        }

        console.log("📧 Gửi email đến người thuê và chủ xe");

        try {
          await sendPaymentSuccessEmail(
            owner.email,
            renter.email,
            owner.fullName,
            renter.fullName,
            renter.phone,
            bike.title
          );
          console.log("✅ Gửi mail thành công");
        } catch (error) {
          console.error("❌ Gửi mail không thành công:", error.message);
        }

      } catch (err) {
        console.error("❌ Lỗi khi cập nhật DB:", err);
      }
    } else {
      console.log(`❌ Giao dịch thất bại - Mã lỗi ${resultCode}`);
    }

    // Phản hồi HTTP 204 đúng yêu cầu MoMo
    return res.status(204).end();
  };
  