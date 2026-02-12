const mongoose = require("mongoose");
const Order = require("../models/Order");
const Review = require("../models/Review");
const PushSubscription = require("../models/PushSubscription");
const webpush = require("web-push");

exports.createOrder = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const now = new Date();
    const IST_OFFSET_MIN = 330;
    const istNow = new Date(now.getTime() + IST_OFFSET_MIN * 60 * 1000);
    const minutes = istNow.getUTCHours() * 60 + istNow.getUTCMinutes();
    const openAt = 11 * 60 + 50;
    const closeAt = 22 * 60 + 30;
    if (minutes < openAt) {
      return res
        .status(400)
        .json({ message: "Sorry, we are not open yet." });
    }
    if (minutes > closeAt) {
      return res.status(400).json({ message: "We are closed." });
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

    const vapidPublic = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
    if (vapidPublic && vapidPrivate) {
      webpush.setVapidDetails(
        "mailto:admin@madhuban.com",
        vapidPublic,
        vapidPrivate
      );
      const subs = await PushSubscription.find({ isAdmin: true }).lean();
      const payload = JSON.stringify({
        title: "New Order",
        body: `Order from ${order.address?.name || "Customer"} • ₹${
          order.totals?.orderTotal || 0
        }`,
        url: "/admin",
      });
      for (const sub of subs) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            payload
          );
        } catch (err) {
          // ignore failed endpoints
        }
      }
    }

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

    const orders = await Order.find({ status: { $nin: ["delivered", "canceled"] } })
      .sort({ createdAt: -1 })
      .lean();
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
    if (!userId) {
      return res.status(200).json({ orders: [] });
    }
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    const orderIds = orders.map((order) => String(order._id));
    const reviews = await Review.find({ orderId: { $in: orderIds } })
      .select("orderId")
      .lean();
    const reviewedSet = new Set(reviews.map((review) => String(review.orderId)));
    const withFlags = orders.map((order) => ({
      ...order,
      reviewed: reviewedSet.has(String(order._id)),
    }));
    return res.status(200).json({ orders: withFlags });
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
    const allowed = new Set(["placed", "prepared", "delivered", "canceled"]);
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

exports.getMonthlyStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const monthParam = String(req.query.month || "");
    let year = new Date().getFullYear();
    let monthIndex = new Date().getMonth();
    if (/^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split("-").map(Number);
      year = y;
      monthIndex = m - 1;
    }

    const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0));

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totals.orderTotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      month: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
      stats: stats.map((row) => ({
        date: row._id,
        orders: row.orders || 0,
        revenue: row.revenue || 0,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.cancelMyOrder = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const { id } = req.params;
    const userId = req.user?.id || "";

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "placed") {
      return res.status(400).json({
        message:
          "Sorry, order can't be canceled because it is already prepared.",
      });
    }

    order.status = "canceled";
    await order.save();

    return res.status(200).json({ message: "Order canceled", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getTodayDeliveredStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const now = new Date();
    const IST_OFFSET_MIN = 330;
    const offsetMs = IST_OFFSET_MIN * 60 * 1000;
    const istNow = new Date(now.getTime() + offsetMs);
    const istStartUTC = new Date(
      Date.UTC(
        istNow.getUTCFullYear(),
        istNow.getUTCMonth(),
        istNow.getUTCDate(),
        0,
        0,
        0
      )
    );
    const start = new Date(istStartUTC.getTime() - offsetMs);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    const result = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: "$totals.orderTotal" },
        },
      },
    ]);

    const stats = result[0] || { orders: 0, revenue: 0 };
    return res.status(200).json({
      date: istNow.toISOString().slice(0, 10),
      orders: stats.orders || 0,
      revenue: stats.revenue || 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
