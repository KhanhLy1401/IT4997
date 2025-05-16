import Review from "../models/Review.js";

export const addReview = async (req, res) => {
    try {
        const { bikeId, userId, rating, comment } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!bikeId || !userId || !rating) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết." });
        }

        // Tạo review mới
        const newReview = new Review({
            bikeId,
            userId,
            rating,
            comment
        });

        await newReview.save();

        res.status(201).json({ message: "Đánh giá thành công!", review: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Có lỗi xảy ra khi thêm đánh giá." });
    }
}