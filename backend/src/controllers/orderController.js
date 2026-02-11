const mongoose = require("mongoose");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { address, items, totals, paymentMethod, customerName, customerUsername } =
      req.body || {};

    if (!address || !address.name || !address.phone || !address.addressLine1) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const order = await Order.create({
      address,
      items,
      totals,
      paymentMethod: paymentMethod || "cod",
      customerName: customerName || address.name || "",
      customerUsername: customerUsername || "",
    });

    return res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
