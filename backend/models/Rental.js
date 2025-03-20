import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
    ownerId: String,
    userId: String,
    bikeId: String,
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    paymentStatus: String,
    status: String,
    createdAt: {type: Date, default: Date.now}
})

export default mongoose.model('Rental', rentalSchema);