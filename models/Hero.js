import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 20 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
