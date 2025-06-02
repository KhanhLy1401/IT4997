import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const SALT_ROUNDS = 10;
const JWT_SECRET = 'ROSES_BLACKPINK'; 

// Đăng ký người dùng
export const signUpUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Kiểm tra email đã tồn tại
    const existingEmail = await User.findOne({ email });
    const existingPhone = await User.findOne({phone});
    if (existingEmail) {
      return res.status(400).json({ message: 'Email đã được sử dụng.' });
    }

    if (existingPhone) {
      return res.status(400).json({ message: 'Số điện thoại đã được sử dụng.' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Tạo người dùng mới
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone, 
    });

    await newUser.save();
    res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Đăng nhập người dùng
export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email có tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    // So sánh mật khẩu
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Sai mật khẩu.' });
    }

    

    // Tạo JWT token
    const token = jwt.sign({ _id: user._id, email: user.email, phone: user.phone, fullName: user.fullName, role: user.role, isBlocked: user.isBlocked }, JWT_SECRET, { expiresIn: '6h' });

    res.status(200).json({ message: 'Đăng nhập thành công!', token });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }

};


