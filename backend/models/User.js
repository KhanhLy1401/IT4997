import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    isBlocked: { type: Boolean, default: false }, // Trường để khóa/mở tài khoản
    blockedAt: { type: Date, default: null }, // Ngày bị khóa (tùy chọn)
    blockReason: { type: String, default: "" },
    role: {type: String, enum: ["user", "owner", "admin"], default: "user"},
    address: String,
    citizen_id: String,
    license_number: String,
    avatar_url: { type: String },
    citizen_images: {
        front: { type: String },
        back: { type: String }
    },
    license_image_url: { type: String },
    banking: {
        account_name: String,
        account_number: String,
        account_holder: String,
    },
    status: { type: String, enum: ["pending", "approved", "rejected"],  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);