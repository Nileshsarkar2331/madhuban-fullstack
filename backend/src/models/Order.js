const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    dishId: { type: String, required: true },
    name: { type: String, default: "" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String, default: "" },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    landmark: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    instructions: { type: String, default: "" },
  },
  { _id: false }
);

const totalsSchema = new mongoose.Schema(
  {
    itemsTotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    orderTotal: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "" },
    customerName: { type: String, default: "" },
    customerUsername: { type: String, default: "" },
    address: { type: addressSchema, required: true },
    items: { type: [orderItemSchema], default: [] },
    totals: { type: totalsSchema, default: {} },
    paymentMethod: { type: String, default: "cod" },
    status: { type: String, default: "placed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
