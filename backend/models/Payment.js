import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentId: String, 
    rentalId: String,
    totalPrice: Number,
    method: String,
    status: String,
    createdAt: {type: Date, default: Date.now}
})

export default mongoose.model('payment', paymentSchema);