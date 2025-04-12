import Bike from '../models/Bike.js'

export const addBike = async (req, res) => {
    try {
        const { ownerId, brand, capacity, bikeType, license_plate, bike_registration, bike_insurance, title, description, location, price, status, images} = req.body;

        const newBike = new Bike({
            ownerId,
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
            status,
            images
        });

        await newBike.save();
        res.status(201).json({message: "Add thành công", bike: newBike});
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

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
