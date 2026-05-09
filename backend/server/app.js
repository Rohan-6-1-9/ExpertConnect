const express = require("express");
const cors = require("cors");
const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

// ── CORS ──
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
)
// ── Body Parsers ──
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Server is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ── API Routes ──
/* app.use("/experts", expertRoutes);
app.use("/bookings", bookingRoutes); */
app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);

// ── 404 Handler ──
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// ── Global Error Handler ──
app.use(errorHandler);

module.exports = app;