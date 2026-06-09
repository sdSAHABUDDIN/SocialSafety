import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    username: { type: String, unique: true },
    bio: { type: String },
    location: { type: String },

    profile_picture: { type: String },
    cover_photo: { type: String },

    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },

    isConnection: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
