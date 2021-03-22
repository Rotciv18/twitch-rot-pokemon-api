import mongoose from 'mongoose';
import PokemonData from './PokemonData';

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
    moves: Array,
  },
  { timestamps: true }
);

export default mongoose.model('Pokemon', PokemonSchema);
