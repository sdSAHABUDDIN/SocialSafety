import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/index.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// All routes go through index router
app.use("/api", apiRoutes);

// Root check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
