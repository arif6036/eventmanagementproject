const express = require("express");
const router = express.Router();
const { getDashboardStats, getFullAnalyticsData } = require("../controllers/dashboardController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, getDashboardStats);

module.exports = router;
