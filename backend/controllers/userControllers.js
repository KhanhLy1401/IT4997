import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


const SALT_ROUNDS = 10;
const JWT_SECRET = 'ROSES_BLACKPINK'; 

// Đăng ký người dùng
export const signUpUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng.' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Tạo người dùng mới
    const newUser = new User({
      userId: new mongoose.Types.ObjectId().toString(),
      fullName,
      email,
      password: hashedPassword,
      phone, 
      role
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
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '6h' });

    res.status(200).json({ message: 'Đăng nhập thành công!', token });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
