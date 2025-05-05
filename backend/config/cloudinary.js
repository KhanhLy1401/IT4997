import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadToCloudinary = async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "motorent", // Đặt thư mục lưu ảnh trên Cloudinary
      });
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.log(error.message);
      throw new Error("Lỗi khi tải ảnh lên Cloudinary");
    }
  };
  

