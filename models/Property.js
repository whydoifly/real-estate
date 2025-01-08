import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  photos: [String],
  address: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  occupancy: {
    type: Boolean,
    default: false,
  },
  ownerPhone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    required: true,
  },
  expenses: String,
  description: String,
  features: [String],
  allowedPets: {
    type: Boolean,
    default: false,
  },
  allowedChildren: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Property ||
  mongoose.model('Property', propertySchema);
