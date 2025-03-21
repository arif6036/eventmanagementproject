const express = require("express");
const { initiatePayment, confirmBooking,initiateStripeCheckout } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/pay", protect, initiatePayment);
router.post("/confirm", protect, confirmBooking);
router.post("/create-checkout-session", protect, initiateStripeCheckout);
router.post("/:eventId/book", protect, confirmBooking); // Confirm Booking After Payment

module.exports = router;
