import User from "../models/User.js";

import { uploadToCloudinary } from "../config/cloudinary.js";

export const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const newRole = req.body.role;

        const user = await User.findById(userId);
        if(!user) return res.status(400).json({message: "Not found user"})
        user.role=newRole;
        await user.save();
        return res.status(201).json(user);

    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) return res.status(404).json({message: "Not found allUsers"});
        return res.status(200).json (users);
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user) return res.status(404).json({message: "Not found user by id"});
        return res.status(200).json(user);
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllOwners = async (req, res) => {
    try {
        const owners = await User.find({role: "owner"});
        if(!owners) return res.status(404).json({message: "Not found owner"})
        return res.status(200).json(owners);
    } catch(error) {
        return res.status(500).json({message: error.message})
    }
}

export const requestOwner = async (req, res) => {
    try {
        const {_id, address, citizen_id, license_number} = req.body;
        const files = req.files; // Lấy file từ multer

        let {banking} = req.body;

        console.log("req.body:", req.body);


        
    // Chỉ parse nếu banking là một chuỗi
    if (typeof banking === 'string') {
        try {
            banking = banking.trim();  // Loại bỏ khoảng trắng đầu và cuối
            banking = JSON.parse(banking); // Chỉ parse nếu là chuỗi
        } catch (error) {
            console.log("Lỗi parse banking:", error);
            return res.status(400).json({ message: "Dữ liệu banking không hợp lệ" });
        }
    } else {
        console.log("Dữ liệu banking đã là object:", banking);
    }
    
    

        const avatar_url = await uploadToCloudinary(files.avatar[0].path);
        const license_image_url = await uploadToCloudinary(files.license_image[0].path);
        const citizen_images = {
        front: await uploadToCloudinary(files.citizen_front[0].path),
        back: await uploadToCloudinary(files.citizen_back[0].path),
        };

        const existingUser = await User.findById(_id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Nếu user đã được approved thì không cho cập nhật nữa
        if (existingUser.status === "approved") {
            return res.status(200).json({ message: "Bạn đã là chủ xe" });
        }

        if(existingUser.status === "pending") {
            return res.status(200).json({message: "Bạn đã gửi yêu  cầu rồi"})
        }
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address,
                citizen_id,
                license_number,
                citizen_images,
                license_image_url,
                avatar_url,
                banking,
                status: "pending" // Đánh dấu chờ duyệt
            },
            { new: true }
        );

        res.status(200).json({ message: "Yêu cầu đã gửi, chờ phê duyệt", user: updatedUser });
    } catch (error) {
        console.error ("lỗi request owner", error);
        return res.status(500).json({message: error.message});
    }
}

export const blockUser =  async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body; // Lý do khóa tài khoản
  
    await User.findByIdAndUpdate(id, {
      isBlocked: true,
      blockedAt: new Date(),
      blockReason: reason || "Vi phạm điều khoản",
    });
  
    res.json({ message: "Tài khoản đã bị khóa!" });
  };
  

export const unblockUser =  async (req, res) => {
    const { id } = req.params;
  
    await User.findByIdAndUpdate(id, {
      isBlocked: false,
      blockedAt: null,
      blockReason: "",
    });
  
    res.json({ message: "Tài khoản đã được mở lại!" });
  };


