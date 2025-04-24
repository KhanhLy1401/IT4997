import Bike from "../models/Bike.js";
import Rental from "../models/Rental.js";

export const  createRental = async (req, res) => {
    try {
        const {ownerId,
            userId,
            bikeId,
            bikeImage,
            startDate,
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

export const getAllRental = async (req, res) => {
    try {
        const rentals = await Rental.find({});
        if(!rentals) return res.status(404).json({message: "Không tìm thấy đơn nào"});
        else return res.status(200).json(rentals)
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

export  const updateRentalStatus = async (req, res ) => {
    try {
        const validStatuses = ["Pending", "Confirmed", "Ongoing", "Completed", "Canceled"];

        const id = req.params.id;
        const newStatus = req.body.status;
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }
        const rental = await Rental.findById(id);

        if(!rental) res.status(404).json({message: "rental not found"});

        rental.status = newStatus;
        await rental.save();

        if(newStatus === "Canceled" || newStatus === "Completed") {
            await Bike.findByIdAndUpdate(rental.bikeId, {status: "available"});
        }

        return res.status(200).json({
            message: "Trạng thái đơn thuê đã được cập nhật",
            rental,
        });


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}