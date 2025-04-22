import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
    url:       { type: String, required: true },
    public_id: { type: String, required: true }
  }, { _id: false });

const bikeSchema = new mongoose.Schema({
    ownerId: String,
    ownerName: String,
    brand: String,
    bikeType: String,
    title: String,
    description: String,
    location: {
        province: String,
        district: String,
        ward: String, 
        detail_location: String,
    },
    capacity: String,
    license_plate: String,
    bike_registration: imageSchema,
    bike_insurance: imageSchema,
    price: {
        perDay: Number,
        perWeek: Number,
        perMonth: Number
    },
    rental_count: { type: Number, default: 0 },
    rental_type: { type: String, enum: ['fixed_location', 'flexible_delivery'] },
    status: {
        type: String,
        enum: ['pending_approval', 'available', 'rented', 'locked'], 
        default: 'pending_approval'
    },
    images: {
        front: imageSchema,
        back: imageSchema,
        side: imageSchema
        
    }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Bike', bikeSchema);
