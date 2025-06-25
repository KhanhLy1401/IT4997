import Bike from '../models/Bike.js'
import { uploadToCloudinary } from "../config/cloudinary.js";
import axios from 'axios';


export const addBike = async (req, res) => {
    try {
        const { ownerId, ownerName, brand, capacity, bikeType, license_plate, title, description, security_deposit, delivery_home } = req.body;
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
            delivery_home,
            security_deposit,
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

export const getAllBikesNotPending = async (req, res) => {
    try {   
        const allBikes = await Bike.find({ status: { $ne: "pending_approval" } });
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

export const getBikesByOwnerId = async (req,res) => {
    try {
        const ownerId = req.params.id;
        const bikes = await Bike.find({ownerId: ownerId});

        return res.status(200).json(bikes);
    } catch (error) {
        return res.status(500).json({error: error.message});
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


// Helper: kiểm tra xe có rảnh không trong khoảng thời gian
function isBikeAvailable(bike, startDate, startTime, endDate, endTime) {
    const reqStart = new Date(`${startDate}T${startTime}`);
    const reqEnd = new Date(`${endDate}T${endTime}`);
  
    for (const period of bike.rentedPeriods) {
      const periodStart = new Date(`${period.startDate.toISOString().split("T")[0]}T${period.startTime}`);
      const periodEnd = new Date(`${period.endDate.toISOString().split("T")[0]}T${period.endTime}`);
      if (reqStart < periodEnd && reqEnd > periodStart) {
        return false;
      }
    }
    return true;
}
  
export const searchAvailableBikes = async (req, res) => {
    const {
      province,
      district,
      ward,
      startDate,
      startTime,
      endDate,
      endTime
    } = req.body;

    if (!province || !district || !ward || !startDate || !startTime || !endDate || !endTime) {
        return res.status(400).json({
          error: "Vui lòng điền đầy đủ thông tin: tỉnh, huyện, xã, ngày giờ bắt đầu và kết thúc."
        });
    }
        
    try {
      const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
  
      // 👉 Bước 1: Suy ra toạ độ từ địa chỉ người dùng chọn
      const address = `${ward}, ${district}, ${province}`;
      const geoUserRes = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            limit: 1
          }
        }
      );
  
      const userCoords = geoUserRes.data.features[0]?.geometry?.coordinates;
      if (!userCoords) {
        return res.status(400).json({ error: "Không tìm được vị trí từ địa chỉ bạn chọn" });
      }
  
      const origin = `${userCoords[0]},${userCoords[1]}`;
  
      // 👉 Bước 2: Tìm xe ở cùng tỉnh và trạng thái available
      const bikes = await Bike.find({
        "location.province": province,
        status: { $ne: "pending_approval" }
      });
      
      if(!bikes) {
        return res.status(200).json("Không có xe ở tỉnh của bạn");
      }
  
      // 👉 Bước 3: Lọc xe rảnh trong khoảng thời gian yêu cầu
      const availableBikes = bikes.filter((bike) =>
        isBikeAvailable(bike, startDate, startTime, endDate, endTime)
      );
  
      // 👉 Bước 4: Tính khoảng cách từ địa chỉ người dùng đến từng xe
      const distancePromises = availableBikes.map(async (bike) => {
        const destAddress = `${bike.location.ward}, ${bike.location.district}, ${bike.location.province}`;
  
        const geoRes = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destAddress)}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              limit: 1
            }
          }
        );
  
        const destCoords = geoRes.data.features[0]?.geometry?.coordinates;
        if (!destCoords) return null;
  
        const directionsRes = await axios.get(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destCoords[0]},${destCoords[1]}`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              overview: "false"
            }
          }
        );
  
        const distanceMeters = directionsRes.data.routes[0]?.distance || Infinity;
  
        return {
          ...bike.toObject(),
          distance: distanceMeters
        };
      });
  
      const bikesWithDistance = (await Promise.all(distancePromises)).filter(Boolean);
  
      // 👉 Bước 5: Sắp xếp theo khoảng cách tăng dần
      const sortedBikes = bikesWithDistance.sort((a, b) => a.distance - b.distance);
  
      res.json(sortedBikes);
    } catch (error) {
      console.error("Received body:", req.body);

      console.error("Search bike error:", error);
      res.status(500).json({ error: "Lỗi server" });
    }
  };


  