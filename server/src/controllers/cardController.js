// controllers/cardController.js

const Card = require("../models/cardModel");

// ✅ Admin creates a card
const createCard = async (req, res) => {
  try {
    const card = new Card(req.body);
    await card.save();
    res.status(201).json({ message: "Card created", card });
  } catch (error) {
    res.status(500).json({ message: "Error creating card", error: error.message });
  }
};

// ✅ Admin deletes a card
const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting card", error: error.message });
  }
};

// ✅ Validate card during booking
const validateCard = async (req, res) => {
  try {
    const { cardHolderName, cardNumber, expiryDate, cvv } = req.body;
    const card = await Card.findOne({ cardHolderName, cardNumber, expiryDate, cvv });

    if (!card) {
      return res.status(401).json({ message: "Invalid card details" });
    }

    res.json({ success: true, message: "Card validated" });
  } catch (error) {
    res.status(500).json({ message: "Validation error", error: error.message });
  }
};

// ✅ Get All Cards (Admin Only)
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Failed to retrieve cards", error: error.message });
  }
};

// ✅ Update Card (Admin Only)
const updateCard = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCard = await Card.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({ message: "Card updated successfully", card: updatedCard });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ message: "Failed to update card", error: error.message });
  }
};

// ✅ Export all controllers
module.exports = {
  createCard,
  deleteCard,
  validateCard,
  getAllCards,
  updateCard,
  validateCard
};
