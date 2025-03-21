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

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize Express App
const app = express();

// ✅ CORS Configuration
// const allowedOrigins = process.env.FRONTEND_URL?.split(",") || [
//   "https://eventmanagementprojectclient.vercel.app",
// ];
const allowedOrigins = [
  "https://eventmanagementprojectclient.vercel.app", // ✅ your frontend domain
  "http://localhost:5173", // optional for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Global Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Default API route
app.get("/", (req, res) => {
  res.send("🚀 EventEase Backend API is running");
});

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Error Handling
app.use((err, req, res, next) => {
  console.error({message:" Server Error:",error: err.message});
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// ✅ Export for Vercel
module.exports = app;
