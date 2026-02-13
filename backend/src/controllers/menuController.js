const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

exports.createMenuItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { name, price, categoryId } = req.body || {};
    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Name, price, category required" });
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const item = await MenuItem.create({
      name: String(name).trim(),
      price: parsedPrice,
      categoryId: String(categoryId).trim(),
    });

    return res.status(201).json({ message: "Menu item added", item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listMenuItems = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const items = await MenuItem.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    return res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
