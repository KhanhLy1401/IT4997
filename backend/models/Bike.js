import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema({
    ownerId: String,
    brand: String,
    bikeType: String,
    title: String,
    description: String,
    location: String,
    capacity: String,
    license_plate: String,
    bike_registration: String,
    bike_insurance: String,
    price: {
        perDay: Number,
        perWeek: Number,
        perMonth: Number
    },
    rental_count: {type: Number, default: 0},
    rental_type: {type: String, enum: ['fixed_location', 'flexible_delivery']},
    status: {
        type: String,
        enum: ['pending_approval', 'available', 'rented', 'locked'], 
        default: 'pending_approval'
    },
    images: [String],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('Bike', bikeSchema)