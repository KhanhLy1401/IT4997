import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    url:       { type: String, required: true },
    public_id: { type: String, required: true }
  }, { _id: false });
const userSchema = new mongoose.Schema({
    fullName: String,
    birthday: Date,
    email: String,
    phone: String,
    password: String,
    isBlocked: { type: Boolean, default: false }, // Trường để khóa/mở tài khoản
    role: {type: String, enum: ["user", "owner", "admin"], default: "user"},
    address: String,
    citizen_id: String,
    avatar_url: imageSchema,
    citizen_images: {
        front: imageSchema,
        back: imageSchema
    },
    banking: {
        account_name: String,
        account_number: String,
        account_holder: String,
    },
    license_image_url: imageSchema,
}, { timestamps: true });

export default mongoose.model('User', userSchema);