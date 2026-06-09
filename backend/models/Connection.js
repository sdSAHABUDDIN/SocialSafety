import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "connected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Connection", connectionSchema);
