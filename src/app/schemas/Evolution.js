import mongoose from 'mongoose';

const EvolutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    atLevel: {
      type: Number,
    },
    trigger: {
      type: String,
      required: true,
    },
    withItem: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Evolution', EvolutionSchema);
