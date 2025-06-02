import Review from "../models/Review.js";
import mongoose from "mongoose";

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


export const getReviewByUser = async (req, res) => {
    try {
        const { bikeId, userId } = req.params;

        if (!bikeId || !userId) {
            return res.status(400).json({ message: "Thiếu bikeId hoặc userId." });
        }

        const review = await Review.findOne({ bikeId, userId });

        if (!review) {
            return false;
        }

        res.status(200).json(review);
    } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi lấy đánh giá." });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { bikeId, userId, rating, comment } = req.body;

        if (!bikeId || !userId || !rating) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết." });
        }

        const existingReview = await Review.findOne({ bikeId, userId });

        if (!existingReview) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá để cập nhật." });
        }

        existingReview.rating = rating;
        existingReview.comment = comment;

        await existingReview.save();

        res.status(200).json({ message: "Cập nhật đánh giá thành công.", review: existingReview });
    } catch (error) {
        console.error("Lỗi khi cập nhật đánh giá:", error);
        res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật đánh giá." });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { bikeId, userId } = req.params;

        if (!bikeId || !userId) {
            return res.status(400).json({ message: "Thiếu bikeId hoặc userId." });
        }

        const deleted = await Review.findOneAndDelete({ bikeId, userId });

        if (!deleted) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá để xóa." });
        }

        res.status(200).json({ message: "Xóa đánh giá thành công." });
    } catch (error) {
        console.error("Lỗi khi xóa đánh giá:", error);
        res.status(500).json({ message: "Có lỗi xảy ra khi xóa đánh giá." });
    }
};


export const getReviewsByBikeId = async (req, res) => {
  try {
    const { bikeId } = req.params;

    if (!bikeId) {
      return res.status(400).json({ message: "Thiếu bikeId." });
    }

    const objectBikeId = new mongoose.Types.ObjectId(bikeId);

    const reviews = await Review.aggregate([
      { $match: { bikeId: bikeId } },  // Nếu bikeId là ObjectId thì chuyển kiểu
      {
        $lookup: {
          from: "users", // Tên collection (không phải model)
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          userId: 1,
          bikeId: 1,
          "userInfo.email": 1,
                  }
      }
    ]);

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.status(200).json({
      reviews,
      averageRating: Number(averageRating.toFixed(1))
    });

  } catch (err) {
    console.error("Lỗi khi lấy đánh giá:", err);
    res.status(500).json({ message: "Lỗi khi lấy đánh giá." });
  }
};

