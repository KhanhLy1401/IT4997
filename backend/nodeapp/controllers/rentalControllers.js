import Bike from "../models/Bike.js";
import Rental from "../models/Rental.js";
import mongoose from "mongoose";

export const  createRental = async (req, res) => {
    try {
        const {ownerId,
            userId,
            bikeId,
            bikeImage,
            startDate,
            startTime,
            endTime,
            endDate,
            totalPrice,
            paymentStatus,
            status} = req.body;

        const newRental = new Rental({
            ownerId,
            userId,
            bikeId,
            bikeImage,
            startDate,
            endDate,
            startTime,
            endTime,
            totalPrice,
            paymentStatus,
            status
        })
        await newRental.save();
        console.log("BODY:", req.body);           // kiểm tra có bikeImage không
        console.log("NEW RENTAL:", newRental);    // trước khi lưu
        const savedRental = await newRental.save();
        console.log("SAVED RENTAL:", savedRental);  // sau khi lưu

        res.status(201).json({message: "Tạo đơn thành công", newRental})

    } catch (error) {
        res.status(500).json ({message: error.message});
    }
}

export const getRentalById = async (req, res) => {
    try {
        const rentalId= req.params.id;
        const rental = await Rental.findById(rentalId);
        if(!rental) return res.status(404).json({message: "Không tìm thấy đơn này"});
        else return res.status(200).json(rental);


    } catch(error) {
        res.status(500).json ({message: error.message});
    }
}

export const getAllRentalByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const rentals = await Rental.find({ userId: userId });
        return res.status(200).json(rentals);
    } catch(error) {
        console.error ("Lỗi getAllRentalByUserId:", error.message);
        res.status(500).json ({message: error.message});
    }
}

export const getAllRentalByOwnerId = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const rentals = await Rental.find({ ownerId: ownerId });
        return res.status(200).json(rentals);
    } catch(error) {
        console.error ("Lỗi getAllRentalByOwnerId:", error.message);
        res.status(500).json ({message: error.message});
    }
}


export const getAllRental = async (req, res) => {
    try {
        const rentals = await Rental.find({status: "completed"});
        if(!rentals) return res.status(404).json({message: "Không tìm thấy đơn nào"});
        else return res.status(200).json(rentals)
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

export  const updateRentalStatus = async (req, res ) => {
    try {
        const validStatuses = ["pending", "confirmed", "in_progress", "completed", "canceled"];

        const id = req.params.id;
        const newStatus = req.body.status;
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }
        const rental = await Rental.findById(id);

        if(!rental) res.status(404).json({message: "rental not found"});

        rental.status = newStatus;
        await rental.save();


            // Cập nhật trạng thái
        rental.status = newStatus;
        await rental.save();

        // Nếu là completed: set xe về 'available' và tăng rental_count
        if (newStatus === "completed") {
        await Bike.findByIdAndUpdate(rental.bikeId, {
            $set: { status: "available" },
            $inc: { rental_count: 1 }
        });
        }

        // Nếu là canceled: chỉ set về available
        else if (newStatus === "canceled") {
        await Bike.findByIdAndUpdate(rental.bikeId, { status: "available" });
        }

        return res.status(200).json({
            message: "Trạng thái đơn thuê đã được cập nhật",
            rental,
        });


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getRecentRevenue = async (req, res) => {
    const { ownerId } = req.params;
    const months = parseInt(req.query.months) || 6;

    try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const revenueData = await Rental.aggregate([
        {
        $match: {
            ownerId: ownerId,
            createdAt: { $gte: startDate }
        }
        },
        {
        $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            totalRevenue: { $sum: "$totalPrice" }
        }
        },
        {
        $sort: { _id: 1 }
        }
    ]);

    // ✅ Tạo danh sách tháng theo giờ địa phương (local time)
    const monthsList = [];
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        monthsList.push(`${year}-${month}`);
    }

    // Gộp kết quả
    const revenueMap = {};
    for (const item of revenueData) {
        revenueMap[item._id] = item.totalRevenue;
    }

    const result = monthsList.map(month => ({
        month,
        totalRevenue: revenueMap[month] || 0
    }));

    res.json(result);

    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
    }

}

export const getAllRecentRevenue = async (req, res) => {
  const months = parseInt(req.query.months) || 12;

  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const revenueData = await Rental.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Tạo danh sách các tháng cần hiển thị
    const monthsList = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      monthsList.push(`${y}-${m}`);
    }

    // Gộp dữ liệu từ aggregate
    const revenueMap = Object.fromEntries(revenueData.map(item => [item._id, item.totalRevenue]));

    const result = monthsList.map(month => ({
      month,
      totalRevenue: revenueMap[month] || 0
    }));

    res.json(result);
  } catch (err) {
    console.error("[getAllRecentRevenue] error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getMonthlyOwnerRevenueStats = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const revenueData = await Rental.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate }
        }
      },
      {
        $addFields: {
          ownerIdObj: { $toObjectId: "$ownerId" },
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
        }
      },
      {
        $group: {
          _id: {
            ownerId: "$ownerIdObj",
            month: "$month"
          },
          totalRevenue: { $sum: "$totalPrice" },
          totalRentals: { $sum: 1 },
          rentals: {
            $push: {
              rentalId: "$_id",
              bikeId: "$bikeId",
              userId: "$userId",
              totalPrice: "$totalPrice",
              startDate: "$startDate",
              startTime: "$startTime",
              endDate: "$endDate",
              endTime: "$endTime",
              createdAt: "$createdAt"
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.ownerId",
          monthlyStats: {
            $push: {
              month: "$_id.month",
              totalRevenue: "$totalRevenue",
              totalRentals: "$totalRentals",
              rentals: "$rentals"
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",        // ObjectId đã chuẩn
          foreignField: "_id",
          as: "owner"
        }
      },
      {
        $unwind: "$owner"
      },
      {
        $project: {
          ownerId: "$_id",
          ownerName: "$owner.fullName",
          ownerEmail: "$owner.email",
          ownerPhone: "$owner.phone",
          bankName: "$owner.banking.account_name",
          accountNumber: "$owner.banking.account_number",
          accountHolder: "$owner.banking.account_holder",
          monthlyStats: 1
        }
      }
    ]);

    // Tạo danh sách các tháng gần đây
    const monthsList = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const y = d.getFullYear();
      monthsList.push(`${y}-${m}`);
    }

    // Đảm bảo mỗi owner đều có đủ các tháng, nếu không thì điền 0
    const filledResults = revenueData.map(owner => {
      const monthMap = Object.fromEntries(owner.monthlyStats.map(stat => [stat.month, stat]));
      const completeStats = monthsList.map(m => ({
        month: m,
        totalRevenue: monthMap[m]?.totalRevenue || 0,
        totalRentals: monthMap[m]?.totalRentals || 0,
        rentals: monthMap[m]?.rentals || []
      }));
      return {
        ownerId: owner.ownerId,
        ownerName: owner.ownerName,
        ownerEmail: owner.ownerEmail,
        ownerPhone: owner.ownerPhone,
        bankName: owner.bankName,
        accountNumber: owner.accountNumber,
        accountHolder: owner.accountHolder,
        monthlyStats: completeStats
      };
    });

    res.json(filledResults);
  } catch (err) {
    console.error("Lỗi thống kê:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};




export const getMonthlyRentalCount = async (req, res) => {
    const { ownerId } = req.params;
    const months = parseInt(req.query.months) || 12;
  
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  
      const rentalCounts = await Rental.aggregate([
        {
          $match: {
            ownerId: ownerId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      // Tạo danh sách tháng gần đây
      const monthsList = [];
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        monthsList.push(`${year}-${month}`);
      }
  
      const rentalMap = {};
      for (const item of rentalCounts) {
        rentalMap[item._id] = item.count;
      }
  
      const result = monthsList.map(month => ({
        month,
        rentalCount: rentalMap[month] || 0
      }));
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};
  
// export const getBikeTypeInRental = async (req, res) => {
//     try {
//         // Sử dụng aggregate để nhóm theo loại xe và đếm số lượng xe
//         const bikeCounts = await Rental.aggregate([
//           {
//             $lookup: {
//               from: 'Bike',  // Tên collection của Bike
//               localField: 'bikeId',  // Trường bikeId trong Rental
//               foreignField: '_id',  // Trường _id trong Bike
//               as: 'bikeDetails'  // Tạo một mảng bikeDetails chứa thông tin của xe
//             }
//           },
//           {
//             $unwind: '$bikeDetails'  // Phân tách mảng bikeDetails thành các document riêng biệt
//           },
//           {
//             $group: {
//               _id: '$bikeDetails.bikeType',  // Nhóm theo loại xe (manual hoặc automatic)
//               count: { $sum: 1 }  // Đếm số lượng xe cho mỗi loại
//             }
//           },
//           {
//             $project: {
//               _id: 0,  // Không hiển thị _id
//               bikeType: '$_id',  // Trả về loại xe
//               count: 1  // Trả về số lượng xe
//             }
//           }
//         ]);
    
//         // Trả về kết quả
//         res.json(bikeCounts);
//       } catch (error) {
//         res.status(500).json({ error: 'Lỗi khi đếm xe' });
//       }
// }

export const getBikeTypeInRental = async (req, res) => {
    try {
      const { ownerId } = req.params; // Lấy ownerId từ params của URL (hoặc từ body nếu bạn muốn gửi theo POST)
  
      // Sử dụng aggregate để nhóm theo loại xe và đếm số lượng xe
      const bikeCounts = await Rental.aggregate([
        {
          $match: {
            ownerId: ownerId  // Lọc theo ownerId
          }
        },
        {
            $addFields: {
            bikeIdObject: { $toObjectId: "$bikeId" }
        }
        },
        {
        $lookup: {
            from: 'bikes',
            localField: 'bikeIdObject',
            foreignField: '_id',
            as: 'bikeDetails'
        }
        },
        {
          $unwind: '$bikeDetails'  // Phân tách mảng bikeDetails thành các document riêng biệt
        },
        {
          $group: {
            _id: '$bikeDetails.bikeType',  // Nhóm theo loại xe (manual hoặc automatic)
            count: { $sum: 1 }  // Đếm số lượng xe cho mỗi loại
          }
        },
        {
          $project: {
            _id: 0,  // Không hiển thị _id
            bikeType: '$_id',  // Trả về loại xe
            count: 1  // Trả về số lượng xe
          }
        }
      ]);
  
      // Trả về kết quả
      res.json(bikeCounts);
    } catch (error) {
    console.error(error.message);
      res.status(500).json({ error: 'Lỗi khi đếm xe' });
    }
};

