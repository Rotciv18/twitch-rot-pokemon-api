import mongoose from 'mongoose';

const MoveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    learnAt: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Move', MoveSchema);
