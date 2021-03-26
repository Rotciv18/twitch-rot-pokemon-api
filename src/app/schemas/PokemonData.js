import mongoose from 'mongoose';
import Move from './Move';
import Evolution from './Evolution';

const PokemonDataSchema = new mongoose.Schema(
  {
    pokedex_id: {
      type: Number,
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
    evolutions: [Evolution.schema],
    moves: [Move.schema],
    canLearn: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('PokemonData', PokemonDataSchema);
