/* eslint-disable no-console */
const mongoose = require("mongoose");
require("dotenv").config();

const Order = require("../src/models/Order");
const User = require("../src/models/User");

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");

  const orders = await Order.find({
    $or: [{ userId: { $exists: false } }, { userId: "" }],
  }).lean();

  console.log(`Found ${orders.length} orders without userId`);

  let updated = 0;
  let skipped = 0;

  for (const order of orders) {
    const username = String(order.customerUsername || "").trim();
    if (!username) {
      skipped += 1;
      continue;
    }

    const user = await User.findOne({ username }).lean();
    if (!user) {
      skipped += 1;
      continue;
    }

    await Order.updateOne(
      { _id: order._id },
      { $set: { userId: String(user._id) } }
    );
    updated += 1;
  }

  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);

  await mongoose.disconnect();
  console.log("✅ Done");
};

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
