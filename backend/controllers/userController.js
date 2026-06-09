import User from "../models/User.js";
import Connection from "../models/Connection.js";
import Health from "../models/healthModel.js";

// Create user (temporary, no auth)
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get user profile (connections-only health)
export const getUserProfile = async (req, res) => {
  const { viewerId } = req.query; // who is viewing profile
  const { id } = req.params; // profile owner

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  let health = null;

  const isConnected = await Connection.findOne({
    $or: [
      { requester: viewerId, receiver: id, status: "connected" },
      { requester: id, receiver: viewerId, status: "connected" },
    ],
  });

  if (isConnected) {
    health = await Health.findOne({ user: id });
  }

  res.json({ user, health });
};

// Update Profile
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};