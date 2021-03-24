import mongoose from 'mongoose';

const MoveDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    moveName: String,
  },
  { timestamps: true }
);

export default mongoose.model('MoveData', MoveDataSchema);
