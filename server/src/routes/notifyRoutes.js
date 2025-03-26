
const express = require("express");
const router = express.Router();
const { sendBroadcast } = require("../controllers/notifyController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// POST /api/notify/broadcast
router.post("/broadcast", protect, adminOnly, sendBroadcast);

module.exports = router;
