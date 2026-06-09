import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    visibility: {
      type: String,
      enum: ["connections", "public"],
      default: "connections",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
