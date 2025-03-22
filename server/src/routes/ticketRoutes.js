// routes/ticketRoutes.js
const express = require("express");
const {
  processPayment,
  confirmBooking,
  cancelTicket,
  getUserTickets,
  getEventBookings,
  generateTicket,
  checkInTicket,
  createTicket,
  getAllTickets,
} = require("../controllers/ticketController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Ticket Purchase & Payment
router.post("/payment", protect, processPayment);
router.post("/:eventId/book", protect, confirmBooking);

// ✅ Admin Ticket Management
router.post("/events/:eventId/tickets", protect, adminOnly, createTicket);
router.get("/all", protect, adminOnly, getAllTickets);
router.get("/:id/bookings", protect, adminOnly, getEventBookings);

// ✅ User Ticket Access
router.get("/my-tickets", protect, getUserTickets);
router.delete("/:id/cancel", protect, cancelTicket);

// ✅ QR Code & Check-in
router.get("/ticket/:ticketId", protect, generateTicket);
router.post("/ticket/:ticketId/check-in", protect, checkInTicket);

module.exports = router;
