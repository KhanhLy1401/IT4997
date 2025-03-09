import Bike from '../models/Bike.js'

export const addBike = async (req, res) => {
    try {
        const {bikeId, ownerId, brand, bikeType, title, desciption, location, price, status, images} = req.body;

        const newBike = new Bike({
            bikeId,
            ownerId,
            brand,
            bikeType,
            title,
            description,
            location,
            price,
            status,
            images
        });

        await newBike.save();
        res.status(201).json(newBike);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}