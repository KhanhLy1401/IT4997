
import Bike from "../models/Bike.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';

export const getPendingOwner = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: "pending" });

        if (pendingUsers.length === 0) {
            return res.status(404).json({ message: "Không có yêu cầu nào đang chờ duyệt" });
        }
        

        res.status(200).json({ message: "Danh sách yêu cầu chờ duyệt", users: pendingUsers });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách pending users:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
}

export const approveOwner = async (req, res) => {
    try {
        const { _id, action } = req.body; 

        if (!_id) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({ message: "Hành động không hợp lệ" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { 
                role: action === "approve" ? "owner" : "user",
                status: action === "approve" ? "approved" : "rejected"
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }

        res.status(200).json({ message: `Yêu cầu đã được ${action === "approve" ? "chấp nhận" : "từ chối"}`, user: updatedUser });
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};


export const getPendingLicense = async (req, res) => {
    try {
        const pendingUsers = await User.find({ license_status: "pending" });

        if (pendingUsers.length === 0) {
            return res.status(404).json({ message: "Không có yêu cầu nào đang chờ duyệt" });
        }
        

        res.status(200).json({ message: "Danh sách yêu cầu chờ duyệt bằng lái", users: pendingUsers });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách pending users:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
}


export const approveLicense = async (req, res) => {
  try {
    const { _id, action } = req.body;

    if (!_id) return res.status(400).json({ message: "Thiếu userId" });
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Hành động không hợp lệ" });
    }

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // Nếu từ chối → xóa ảnh Cloudinary
    if (action === "reject" && user.license_image_public_id) {
      await cloudinary.uploader.destroy(user.license_image_public_id);
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        license_status: action === "approve" ? "verified" : "rejected",
        ...(action === "reject" && {
          license_image_url: null,
          license_image_public_id: null
        })
      },
      { new: true }
    );

    res.status(200).json({
      message: `Yêu cầu cấp phép đã được ${action === "approve" ? "chấp nhận" : "từ chối"}`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getPendingBike = async (req, res) =>{
    try {
        const pendingUsers = await Bike.find({ status: "pending_approval" });

        if (pendingUsers.length === 0) {
            return res.status(200).json({ message: "Không có yêu cầu nào đang chờ duyệt" });
        }
        

        res.status(200).json({ message: "Danh sách yêu cầu chờ duyệt", users: pendingUsers });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách pending users:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }

}

export const approveBike = async (req, res) => {
  try {
    const { _id, action } = req.body;

    if (!_id) return res.status(400).json({ message: "Thiếu bikeId" });
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Hành động không hợp lệ" });
    }

    const bike = await Bike.findById(_id);
    if (!bike) return res.status(404).json({ message: "Không tìm thấy bike để chấp nhận" });

    const updatedBike = await Bike.findByIdAndUpdate(
      _id,
      {
        status: action === "approve" ? "available" : "locked"
      },
      { new: true }

    );

    res.status(200).json({
      message: `Yêu cầu cấp phép đã được ${action === "approve" ? "chấp nhận" : "từ chối"}`,
      bike: updatedBike
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};