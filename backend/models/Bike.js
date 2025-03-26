import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
    ownerId: String,
    brand: String,
    bikeType: String,
    title: String,
    description: String,
    location: String,
    license_plate: String,
    price: {
        perDay: Number,
        perWeek: Number,
        perMonth: Number
    },
    rental_count: {type: Number, default: 0},
    typeRental: {type:String },
    status: String,
    images: [String],
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('Bike', bikeSchema)