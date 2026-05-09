const express = require("express");
const router = express.Router();
const {
  getAllExperts,
  getExpertById,
  getExpertSlots
} = require("../controllers/expertController");

// GET /experts          — list all active experts (supports ?domain=&minRating= filters)
router.get("/", getAllExperts);

// GET /experts/:id      — get single expert with all slot details
router.get("/:id/slots", getExpertSlots);
router.get("/:id", getExpertById);

module.exports = router;