const express = require("express");
const { protect, adminOnly,verifyToken } = require("../middleware/authMiddleware");
const {
  createCard,
  deleteCard,
  validateCard,
  getAllCards,
  updateCard,
} = require("../controllers/cardController");

const router = express.Router();

// ✅ Admin Routes
router.post("/", protect, adminOnly, createCard);       // Create Card
router.get("/", protect, adminOnly, getAllCards);       // Get All Cards
router.put("/:id", protect, adminOnly, updateCard);     // Update Card
router.delete("/:id", protect, adminOnly, deleteCard);  // Delete Card

// ✅ Public Route (for validating card during ticket booking)
router.post("/validate", verifyToken, validateCard);
// router.get("/ticket/:ticketId", protect, generateTicket);
module.exports = router;
