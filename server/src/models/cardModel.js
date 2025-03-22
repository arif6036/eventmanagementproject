const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardHolderName: { type: String, required: true },
  cardNumber: { type: String, required: true, unique: true },
  expiryDate: { type: String, required: true }, // Format: MM/YY
  cvv: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Card", cardSchema);