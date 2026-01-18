const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.send("Madhuban backend is live 🚀");
});

// Auth routes (Phone + OTP)
app.use("/api/auth", authRoutes);

module.exports = app;

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);
