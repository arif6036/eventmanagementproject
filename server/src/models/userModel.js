const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "organizer"],
      default: "admin",
    },
    verified: {
      type: Boolean,
      default: false, // 👈 added for email verification
    },
    darkMode: {
      type: Boolean,
      default: false,
    }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
