const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity
} = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/:dishId", authMiddleware, removeFromCart);
router.put("/:dishId", authMiddleware, updateQuantity);

module.exports = router;
