const express = require("express");
const { initiatePayment, confirmBooking } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/pay", protect, initiatePayment);
router.post("/confirm", protect, confirmBooking);
router.post("/:eventId/book", protect, confirmBooking); // Confirm Booking After Payment

module.exports = router;
