const express = require("express");
const {
  createMenuItem,
  listMenuItems,
  deleteMenuItem,
} = require("../controllers/menuController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", listMenuItems);
router.post("/", authMiddleware, adminMiddleware, createMenuItem);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMenuItem);

module.exports = router;
