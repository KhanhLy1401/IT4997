import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
    ownerId: String,
    brand: String,
    bikeType: String,
    title: String,
    description: String,
    location: String,
    price: {
        perDay: Number,
        perWeek: Number,
        perMonth: Number
    },
    status: String,
    images: [String],
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('Bike', bikeSchema)