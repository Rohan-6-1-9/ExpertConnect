const express = require("express");
const router = express.Router();
const {
  createBooking,
  updateBookingStatus,
  getBookingsByEmail,
} = require("../controllers/bookingController");

// POST   /bookings                  — create a new booking
router.post("/", createBooking);

// PATCH  /bookings/:id/status       — update booking status
router.patch("/:id/status", updateBookingStatus);

// GET    /bookings?email=           — get bookings by client email
router.get("/", getBookingsByEmail);

module.exports = router;