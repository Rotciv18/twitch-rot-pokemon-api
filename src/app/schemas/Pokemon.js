import mongoose from 'mongoose';
import PokemonData from './PokemonData';
import Move from './Move';

const PokemonSchema = new mongoose.Schema(
  {
    pokemon_data: PokemonData.schema,
    level: {
      type: Number,
      required: true,
      default: 1,
    },
    name: {
      type: String,
      required: true,
    },
    moves: [Move.schema],
  },
  { timestamps: true }
);

export default mongoose.model('Pokemon', PokemonSchema);
