import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
    url:       { type: String, required: true },
    public_id: { type: String, required: true }
  }, { _id: false });

const rentedPeriodSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    startTime: Date,
    endTime: Date,
});

const bikeSchema = new mongoose.Schema({
    ownerId: String,
    ownerName: String,
    brand: String,
    bikeType: String,
    title: String,
    description: String,
    delivery_home: {type: Boolean, default: false},
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
    price: Number,
    rentedPeriods: [rentedPeriodSchema],
    rental_count: { type: Number, default: 0 },
    rental_type: { type: String, enum: ['fixed_location', 'flexible_delivery'] },
    status: {
        type: String,
        enum: ['pending_approval', 'available', 'rented', 'locked'], 
        default: 'pending_approval'
    },
    security_deposit: {
        type: String,
        default: "no_deposit"
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
