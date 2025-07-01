import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "./ReviewManagement.css";

const ReviewManagement = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/review/all-review`);
      setReviews(response.data);
      console.log("review",response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đánh giá:", error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      try {
        await axios.delete(`${API_URL}/review/delete/${reviewId}`);
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } catch (error) {
        console.error("Xóa thất bại:", error);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="rental-management">
      <h2>Quản lý đánh giá</h2>
      <table className="rental-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Xe</th>
            <th>Người dùng</th>
            <th>Đánh giá</th>
            <th>Bình luận</th>
            <th>Ngày tạo</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review._id}>
              <td>{index + 1}</td>
              <td>{review.bikeId}</td>
              <td>{review.userId}</td>
              <td>{review.rating} ⭐</td>
              <td>{review.comment}</td>
              <td>{moment(review.createdAt).format("DD/MM/YYYY")}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteReview(review._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewManagement;
