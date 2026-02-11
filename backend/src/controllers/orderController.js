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
