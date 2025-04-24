import Bike from '../models/Bike.js'
import { uploadToCloudinary } from "../config/cloudinary.js";
import axios from 'axios';


export const addBike = async (req, res) => {
    try {
        const { ownerId, ownerName, brand, capacity, bikeType, license_plate, title, description } = req.body;
        let { location, price } = req.body;
        const files = req.files;

        // Kiểm tra nếu có trường dữ liệu quan trọng bị thiếu
        if (!ownerId || !ownerName || !title || !description) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin chủ xe và mô tả" });
        }

        // Kiểm tra dữ liệu price và location có hợp lệ không
        try {
            location = location.trim();  // Loại bỏ khoảng trắng đầu và cuối
            location = JSON.parse(location); // Chuyển chuỗi location thành object
        } catch (error) {
            console.error("Lỗi khi parse location:", error);
            return res.status(400).json({ message: "Thông tin địa chỉ không hợp lệ" });
        }

        try {
            price = price.trim(); // Loại bỏ khoảng trắng đầu và cuối
            price = JSON.parse(price); // Chuyển chuỗi price thành object
        } catch (error) {
            console.error("Lỗi khi parse price:", error);
            return res.status(400).json({ message: "Thông tin giá không hợp lệ" });
        }

        // Kiểm tra nếu không có files hoặc thiếu một số file cần thiết
        if (!files || !files.bike_registration || !files.bike_insurance || !files.images_front || !files.images_back || !files.images_side) {
            return res.status(400).json({ message: "Vui lòng tải lên đầy đủ các ảnh yêu cầu" });
        }

        // Upload ảnh lên Cloudinary
        const bike_registration = await uploadToCloudinary(files.bike_registration[0].path);
        const bike_insurance = await uploadToCloudinary(files.bike_insurance[0].path);
        const images = {
            front: await uploadToCloudinary(files.images_front[0].path),
            back: await uploadToCloudinary(files.images_back[0].path),
            side: await uploadToCloudinary(files.images_side[0].path),
        };

        // Tạo đối tượng mới và lưu vào cơ sở dữ liệu
        const newBike = new Bike({
            ownerId,
            ownerName,
            brand,
            capacity,
            bikeType,
            license_plate,
            bike_registration,
            bike_insurance,
            title,
            description,
            location,
            price,
            status: "pending_approval", // Trạng thái xe là chờ phê duyệt
            images
        });

        await newBike.save();
        res.status(201).json({ message: "Thêm xe thành công", bike: newBike });
    } catch (error) {
        console.error("Error in addBike:", error);
        res.status(500).json({ message: "Lỗi hệ thống", details: error.message });
    }
};


export const getAllBikes = async (req, res) => {
    try {   
        const allBikes = await Bike.find();
        res.status(200).json(allBikes);

    } catch(error) {
        res.status(500).json({error: error.message});
    }

}

export const getBikeById = async (req, res) => {
    try {
        const bikeId = req.params.id;
        const bike = await Bike.findById(bikeId);
        if (!bike) return res.status(404).json({ message: "Không tồn tại xe này" });

        else return res.json(bike);
    } catch(error) {
        res.status(500).json({error: error.message});

    }

}

export const deleteBikeById = async (req, res) => {
    try {
        const bikeId = req.params.id;
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).json({ message: "Không tồn tại xe này" });
        }

        // Xóa xe
        await Bike.findByIdAndDelete(bikeId);
        
        return res.json({ message: "Xe đã được xóa thành công" });
      
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteAllBikes = async (req, res) => {
    try {
        const bikes = await Bike.find();

        // Nếu không có xe nào
        if (!bikes || bikes.length === 0) {
            return res.status(404).json({ message: "Không tồn tại xe nào" });
        }

        // Xóa tất cả xe
        await Bike.deleteMany({}); // Xóa tất cả

        return res.status(200).json({ message: "Đã xóa thành công tất cả xe", deletedCount: bikes.length });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getDistance = async (req, res) => {
    // const { origins, destinations } = req.query;
    const API_KEY=process.env.API_KEY;
    console.log(API_KEY);
    const origins = 'Hà Nội';
    const destinations = 'Thành phố Hồ Chí Minh';
  
    if (!origins || !destinations) {
      return res.status(400).json({ error: 'Thiếu thông tin origins hoặc destinations' });
    }
  
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${API_KEY}`;
  
    try {
      const response = await axios.get(url);
      return res.json(response.data);
    } catch (error) {
      console.error('Lỗi khi gọi Google API:', error.message);
      return res.status(500).json({ error: 'Lỗi khi gọi Google API', detail: error.message });
    }
};
