import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: String,
    fullName: String,
    email: String,
    phone: Number,
    password: String,
    role: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

export default mongoose.model('User', userSchema);