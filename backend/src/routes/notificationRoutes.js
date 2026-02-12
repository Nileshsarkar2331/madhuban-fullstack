const express = require("express");
const { subscribe } = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/subscribe", authMiddleware, adminMiddleware, subscribe);

module.exports = router;
