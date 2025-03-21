require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");


// Import Routes
const userRoutes = require("./src/routes/userRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

// ✅ Connect to Database
connectDB();

// ✅ Initialize Express App
const app = express();

// ✅ CORS Middleware (Dynamically from .env)
const allowedOrigins = process.env.FRONTEND_URL?.split(",") || ["http://localhost:5173"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
// ✅ Middleware
app.use(cookieParser()); // 🔹 Parses cookies for authentication
app.use(express.json()); // 🔹 Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // 🔹 Parses URL-encoded bodies


// ✅ Routes
app.get("/", (req, res) => {
  res.send("API is running"); 
});

app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Server error, please try again later." });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app; // For Vercel
