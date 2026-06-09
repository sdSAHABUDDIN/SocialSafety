import Post from "../models/Post.js";
import Connection from "../models/Connection.js";

export const createPost = async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json(post);
};

export const getFeed = async (req, res) => {
  const { userId } = req.params;

  const connections = await Connection.find({
    status: "connected",
    $or: [{ requester: userId }, { receiver: userId }],
  });

  const ids = connections.map((c) =>
    c.requester.toString() === userId ? c.receiver : c.requester
  );

  ids.push(userId);

  const posts = await Post.find({
    user: { $in: ids },
  }).populate("user");

  res.json(posts);
};
