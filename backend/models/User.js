import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: String,
    birthday: Date,
    gender: {type: String, enum:["Male", "Female", "Other"]},
    email: String,
    phone: String,
    password: String,
    isBlocked: { type: Boolean, default: false }, // Trường để khóa/mở tài khoản
    blockedAt: { type: Date, default: null }, // Ngày bị khóa (tùy chọn)
    blockReason: { type: String, default: "" },
    role: {type: String, enum: ["user", "owner", "admin"], default: "user"},
    address: String,
    citizen_id: String,
    avatar_url: { type: String },
    citizen_images: {
        front: { type: String },
        back: { type: String }
    },
    banking: {
        account_name: String,
        account_number: String,
        account_holder: String,
    },
    rental_count: Number,
    license_number: String,
    license_name: String,
    license_date: Date,
    license_image_url: { type: String },
    license_image_public_id: String,
    license_status: {type: String, enum: ["not_uploaded","pending", "verified", "rejected"], default: "not_uploaded"},
    status: { type: String, enum: ["not_uploaded", "pending", "approved", "rejected"], default: "not_uploaded" }
}, { timestamps: true });

export default mongoose.model('User', userSchema);