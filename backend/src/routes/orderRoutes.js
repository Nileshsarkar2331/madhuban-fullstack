const express = require("express");
const {
  createOrder,
  listOrders,
  listMyOrders,
  getMonthlyStats,
  cancelMyOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, adminMiddleware, listOrders);
router.get("/my", authMiddleware, listMyOrders);
router.patch("/my/:id/cancel", authMiddleware, cancelMyOrder);
router.get("/stats", authMiddleware, adminMiddleware, getMonthlyStats);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
