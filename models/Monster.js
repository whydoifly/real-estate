import mongoose from 'mongoose';

const MonsterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      enum: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
    },
    alignment: {
      type: String,
      required: [true, 'Alignment is required'],
    },
    armorClass: {
      type: Number,
      required: [true, 'Armor Class is required'],
      min: [0, 'Armor Class cannot be negative'],
    },
    hitPoints: {
      type: Number,
      required: [true, 'Hit Points are required'],
      min: [1, 'Hit Points must be at least 1'],
    },
    speed: {
      type: String,
      required: [true, 'Speed is required'],
    },
    strength: {
      type: Number,
      required: [true, 'Strength is required'],
      min: [1, 'Strength must be at least 1'],
    },
    dexterity: {
      type: Number,
      required: [true, 'Dexterity is required'],
      min: [1, 'Dexterity must be at least 1'],
    },
    constitution: {
      type: Number,
      required: [true, 'Constitution is required'],
      min: [1, 'Constitution must be at least 1'],
    },
    intelligence: {
      type: Number,
      required: [true, 'Intelligence is required'],
      min: [1, 'Intelligence must be at least 1'],
    },
    wisdom: {
      type: Number,
      required: [true, 'Wisdom is required'],
      min: [1, 'Wisdom must be at least 1'],
    },
    charisma: {
      type: Number,
      required: [true, 'Charisma is required'],
      min: [1, 'Charisma must be at least 1'],
    },
    challengeRating: {
      type: Number,
      required: [true, 'Challenge Rating is required'],
      min: [0, 'Challenge Rating cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Monster ||
  mongoose.model('Monster', MonsterSchema);
