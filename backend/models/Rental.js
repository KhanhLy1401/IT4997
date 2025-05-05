import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
    url:       { type: String, required: true },
    public_id: { type: String, required: true }
}, { _id: false });

const rentalSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  userId: { type: String, required: true },
  bikeId: { type: String, required: true },
  startDate: { type: Date, required: true },
  startTime: String,
  endDate: { type: Date, required: true },
  endTime: String,
  totalPrice: { type: Number, required: true },
  bikeImage: String,

  // Trạng thái thanh toán
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed', 'refunded', 'pending'],
    default: 'unpaid'
  },

  // Trạng thái đơn thuê
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Rental', rentalSchema);
