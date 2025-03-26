import multer from "multer";
import path from "path";

// Cấu hình Multer để lưu trữ tệp tạm thời
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo timestamp
  },
});

export const  upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn file 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ được upload hình ảnh"), false);
    }
    cb(null, true);
  },
});

