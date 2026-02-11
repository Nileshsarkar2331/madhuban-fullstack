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
      userId: req.user?.id || "",
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

exports.listMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const userId = req.user?.id || "";
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { id } = req.params;
    const { status } = req.body || {};
    const allowed = new Set(["placed", "prepared", "delivered"]);
    if (!allowed.has(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
