
import './Register.css'

const Register = () => {
  return (
    <div className='register-owner'>

        <div className='register-form'>
            <div className='main-content'>
                <h1>
                    <span className='text-success'>Cho Thuê Xe </span>
                    Trên Motorent để gia tăng thu nhập
                </h1>
                <p>Motorent không thu phí khi bạn đăng kí xe. Bạn chỉ chia sẻ phí dịch vụ với Motorent khi có giao dịch cho thuê thành công</p>
                <div className='line'></div>
                <div className='hotline'>
                    <div className='hotline-phone'>Hotline: 0946234129</div>
                    <div className='hotline-chatbox'>Hoặc để lại tin nhắn cho Motorent qua boxchat</div>
                    <a className='btn-register' href='/owner/register-form'>Đăng ký ngay</a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register