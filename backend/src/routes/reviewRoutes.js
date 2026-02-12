const express = require("express");
const {
  createReview,
  listReviews,
  listPublicReviews,
  updateReviewVisibility,
} = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/", authMiddleware, adminMiddleware, listReviews);
router.get("/public", listPublicReviews);
router.patch("/:id/visibility", authMiddleware, adminMiddleware, updateReviewVisibility);

module.exports = router;
