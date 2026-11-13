import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, required: true, trim: true, maxlength: 40 },
    price: { type: Number, required: true, min: 1 },
    durationMin: { type: Number, required: true, min: 5 },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    imageUrl: { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Service', serviceSchema);
