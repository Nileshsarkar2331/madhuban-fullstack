const express = require("express");
const {
  createReview,
  listReviews,
  listPublicReviews,
} = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/", authMiddleware, adminMiddleware, listReviews);
router.get("/public", listPublicReviews);

module.exports = router;
