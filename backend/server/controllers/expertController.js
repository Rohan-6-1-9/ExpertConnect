const Expert = require("../models/Expert");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

// ─────────────────────────────────────
// GET /experts
// Returns all active experts (with available slots summary)
// ─────────────────────────────────────
const getAllExperts = asyncHandler(async (req, res) => {
const { search, category, minRating, sortBy, minPrice, maxPrice } = req.query;

const filter = { isActive: true };

if (search) {
  filter.name = {
    $regex: search,
    $options: "i",
  };
}

if (category) {
  filter.domain = {
    $regex: category,
    $options: "i",
  };
}

if (minRating) {
  filter.rating = {
    $gte: parseFloat(minRating),
  };
}
if (minPrice || maxPrice) {
  filter.sessionRate = {};

  if (minPrice) {
    filter.sessionRate.$gte = parseFloat(minPrice);
  }

  if (maxPrice) {
    filter.sessionRate.$lte = parseFloat(maxPrice);
  }
}
let sortOption = {};

if (sortBy === "price-low") {
  sortOption.sessionRate = 1;
}

if (sortBy === "price-high") {
  sortOption.sessionRate = -1;
}

if (sortBy === "rating") {
  sortOption.rating = -1;
}
  const experts = await Expert.find(filter)
  .sort(sortOption)
  .select("-__v")
  .lean({ virtuals: true });

  // Attach freeSlotCount manually for lean()
  const enriched = experts.map((e) => ({
    ...e,
    freeSlotCount: e.availableSlots.filter((s) => !s.isBooked).length,
  }));

  res.status(200).json({
    success: true,
    count: enriched.length,
    data: enriched,
  });
});

// ─────────────────────────────────────
// GET /experts/:id
// Returns single expert with all slot details
// ─────────────────────────────────────
const getExpertById = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id).select("-__v");

  if (!expert) {
    throw new AppError(`Expert not found with id: ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: expert,
  });
});

const getExpertSlots = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id);

  if (!expert) {
    throw new AppError("Expert not found", 404);
  }

  const { date } = req.query;

  let slots = expert.availableSlots || [];

  if (date) {
    slots = slots.filter(slot => slot.date === date);
  }

  res.status(200).json({
    success: true,
    slots,
  });
});

module.exports = {
  getAllExperts,
  getExpertById,
  getExpertSlots,
};