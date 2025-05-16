import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    bikeId: String,
    userId: String,
    rating: Number,
    comment: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

export default mongoose.model('Review', reviewSchema);