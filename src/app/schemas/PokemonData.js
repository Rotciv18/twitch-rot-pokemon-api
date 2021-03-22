import mongoose from 'mongoose';

const PokemonDataSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sprite: String,
    canEvolve: {
      type: Boolean,
      default: false,
    },
    evolutions: Array,
    moves: Array,
  },
  { timestamps: true }
);

export default mongoose.model('PokemonData', PokemonDataSchema);
