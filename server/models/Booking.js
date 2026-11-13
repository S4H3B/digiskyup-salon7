import crypto from 'crypto';
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    ref: {
      type: String,
      unique: true,
      default: () => `SALON7-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    stylist: { type: String, required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
  },
  { timestamps: true },
);

// One active booking per stylist, date and slot. Cancelled bookings free the slot.
bookingSchema.index(
  { stylist: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: 'Confirmed' } },
);

export default mongoose.model('Booking', bookingSchema);
