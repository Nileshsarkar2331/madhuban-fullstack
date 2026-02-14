const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    username: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    images: { type: [String], default: [] },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
