const express = require("express");
const router = express.Router();
const {
  addReview,
  getReviews,
  getAllReviews,
  updateReview,
  deleteReview,
  approveReview,
} = require("../controllers/reviewController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// User routes
router.post("/:eventId", protect, addReview);
router.get("/:eventId", getReviews);

// Admin-only routes
router.get("/",getAllReviews);//public  remove protect, adminOnly, 
router.put("/:id/approve", protect, adminOnly, approveReview);
router.delete("/:id", protect, adminOnly, deleteReview);

module.exports = router;
