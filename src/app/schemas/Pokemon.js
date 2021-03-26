import mongoose, { Schema } from 'mongoose';
import Move from './Move';

const PokemonSchema = new mongoose.Schema(
  {
    pokemon_data_id: { type: Schema.Types.ObjectId },
    pokedex_id: { type: Number, requires: true },
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
