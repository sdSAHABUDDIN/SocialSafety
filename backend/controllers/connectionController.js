import Connection from "../models/Connection.js";

// Send connection request
export const sendRequest = async (req, res) => {
  const connection = await Connection.create(req.body);
  res.status(201).json(connection);
};

// Accept request
export const acceptRequest = async (req, res) => {
  const connection = await Connection.findByIdAndUpdate(
    req.params.id,
    { status: "connected" },
    { new: true }
  );
  res.json(connection);
};

// Get connections (ONLY connected)
export const getConnections = async (req, res) => {
  const { userId } = req.params;

  const connections = await Connection.find({
    status: "connected",
    $or: [{ requester: userId }, { receiver: userId }],
  }).populate("requester receiver");

  res.json(connections);
};

// Get pending requests
export const getPending = async (req, res) => {
  const pending = await Connection.find({
    receiver: req.params.userId,
    status: "pending",
  }).populate("requester");

  res.json(pending);
};
