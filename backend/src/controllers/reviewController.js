const mongoose = require("mongoose");
const Review = require("../models/Review");
const Order = require("../models/Order");

exports.createReview = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const userId = req.user?.id;
    const { orderId, rating, comment, images } = req.body || {};

    if (!orderId || !rating) {
      return res.status(400).json({ message: "Order and rating are required" });
    }

    const parsedRating = Number(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be 1 to 5" });
    }

    const order = await Order.findOne({ _id: orderId, userId }).lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Order not delivered yet" });
    }

    const existing = await Review.findOne({ orderId }).lean();
    if (existing) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    const safeImages = Array.isArray(images) ? images.slice(0, 3) : [];

    const review = await Review.create({
      orderId: String(orderId),
      userId: String(userId),
      rating: parsedRating,
      comment: comment || "",
      images: safeImages,
    });

    return res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listReviews = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listPublicReviews = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select("rating comment images createdAt")
      .lean();
    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
