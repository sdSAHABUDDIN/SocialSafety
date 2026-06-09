import mongoose from "mongoose";

const healthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    heartRate: Number,
    temperature: Number,
    motion: Number, // 1 or 0

    status: {
      type: String,
      enum: ["Normal", "Warning", "Emergency"],
      default: "Normal",
    },
    deviceConnected: {
      type: Boolean,
      default: true,
    },

    lat: Number,
    lng: Number,

    lastSync: String,
  },
  { timestamps: true }
);

export default mongoose.model("Health", healthSchema);
