import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema(
  {
    photos: {
      type: [String],
      required: false,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    occupancy: {
      type: Boolean,
      required: [true, 'Occupancy is required'],
    },
    ownerPhone: {
      type: String,
      required: [true, 'Owner Phone is required'],
    },
    district: {
      type: String,
      required: [true, 'District is required'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Bedrooms are required'],
      min: [0, 'Bedrooms cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    commission: {
      type: Number,
      required: [true, 'Commission is required'],
      min: [0, 'Commission cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    features: {
      type: [String],
      required: [true, 'Features are required'],
    },
    allowedPets: {
      type: Boolean,
      required: [true, 'Allowed Pets is required'],
    },
    allowedChildren: {
      type: Boolean,
      required: [true, 'Allowed Children is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Property ||
  mongoose.model('Property', PropertySchema);
