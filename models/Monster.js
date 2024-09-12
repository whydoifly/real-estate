import mongoose from 'mongoose';

const MonsterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  alignment: { type: String, required: true },
  armorClass: { type: Number, required: true },
  hitPoints: { type: Number, required: true },
  speed: { type: String, required: true },
  strength: { type: Number, required: true },
  dexterity: { type: Number, required: true },
  constitution: { type: Number, required: true },
  intelligence: { type: Number, required: true },
  wisdom: { type: Number, required: true },
  charisma: { type: Number, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.Monster ||
  mongoose.model('Monster', MonsterSchema);
