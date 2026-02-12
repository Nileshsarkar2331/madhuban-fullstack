const mongoose = require("mongoose");
const PushSubscription = require("../models/PushSubscription");

exports.subscribe = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { endpoint, keys } = req.body || {};
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid subscription" });
    }

    const isAdmin = Boolean(req.user?.isAdmin);
    await PushSubscription.updateOne(
      { endpoint },
      { $set: { endpoint, keys, isAdmin } },
      { upsert: true }
    );

    return res.status(200).json({ message: "Subscribed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
