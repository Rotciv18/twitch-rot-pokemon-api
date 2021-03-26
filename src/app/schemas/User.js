import mongoose from 'mongoose';
import Pokemon from './Pokemon';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
      default: 1,
    },
    pokemons: {
      type: [Pokemon.schema],
      default: [],
    },
    setup: [Pokemon.schema],
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
