const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Expert = require("../models/Expert");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const { getIO } = require("../socket/socketManager");

// ─────────────────────────────────────
// POST /bookings
// Create a new booking & mark slot as booked
// ─────────────────────────────────────
const createBooking = asyncHandler(async (req, res) => {
  const {
    expertId,
    slotId,
    clientName,
    clientEmail,
    clientPhone,
    notes,
  } = req.body;

  // Validate required fields
  if (!expertId || !slotId || !clientName || !clientEmail) {
    throw new AppError(
      "expertId, slotId, clientName, and clientEmail are required",
      400
    );
  }

  // Find expert
  const expert = await Expert.findById(expertId);

  if (!expert) {
    throw new AppError("Expert not found", 404);
  }

  // Safe slots access
  const slots = expert.availableSlots || [];

  // Find slot safely
  const slot = slots.find(
    (s) => s._id.toString() === slotId.toString()
  );

  if (!slot) {
    throw new AppError("Selected slot not found", 404);
  }

  // Prevent double booking
  if (slot.isBooked) {
    throw new AppError("This slot is already booked", 409);
  }

  // Transaction session
  const session = await mongoose.startSession();

  let booking;

  try {
    session.startTransaction();

    // Mark slot booked
    slot.isBooked = true;

    await expert.save({ session });

    // Create booking
    booking = await Booking.create(
      [
        {
          expert: expertId,
          slotId: slot._id,
          slotDate: slot.date,
          slotTime: slot.time,
          clientName,
          clientEmail: clientEmail.toLowerCase(),
          clientPhone: clientPhone || "",
          notes: notes || "",
          status: "pending",
        },
      ],
      { session }
    );

    booking = booking[0];

    await session.commitTransaction();

  } catch (err) {

    await session.abortTransaction();

    if (err.code === 11000) {
      throw new AppError(
        "This slot has already been booked",
        409
      );
    }

    throw err;

  } finally {

    session.endSession();

  }

  // Emit realtime update
  const io = getIO();

  io.emit("slot:booked", {
    expertId,
    slotId: slot._id,
    slotDate: slot.date,
    slotTime: slot.time,
  });

  io.to(`expert:${expertId}`).emit("slot:booked", {
    slotId: slot._id,
    slotDate: slot.date,
    slotTime: slot.time,
  });

  // Response
  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    booking: await booking.populate(
      "expert",
      "name email domain profileImage sessionRate"
    ),
  });
});

// ─────────────────────────────────────
// PATCH /bookings/:id/status
// ─────────────────────────────────────
const updateBookingStatus = asyncHandler(async (req, res) => {

  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "cancelled",
    "completed",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      `Status must be one of: ${allowedStatuses.join(", ")}`,
      400
    );
  }

  const booking = await Booking.findById(req.params.id)
    .populate("expert");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const previousStatus = booking.status;

  booking.status = status;

  // Free slot on cancellation
  if (
    status === "cancelled" &&
    previousStatus !== "cancelled"
  ) {

    const expert = await Expert.findById(
      booking.expert._id || booking.expert
    );

    if (expert) {

      const slot = expert.availableSlots.id(
        booking.slotId
      );

      if (slot) {

        slot.isBooked = false;

        await expert.save();

        const io = getIO();

        io.emit("slot:freed", {
          expertId: expert._id.toString(),
          slotId: booking.slotId.toString(),
          slotDate: booking.slotDate,
          slotTime: booking.slotTime,
        });

        io.to(`expert:${expert._id}`).emit(
          "slot:freed",
          {
            slotId: booking.slotId.toString(),
            slotDate: booking.slotDate,
            slotTime: booking.slotTime,
          }
        );
      }
    }
  }

  await booking.save();

  const io = getIO();

  io.emit("booking:statusChanged", {
    bookingId: booking._id,
    previousStatus,
    newStatus: status,
  });

  res.status(200).json({
    success: true,
    message: `Booking status updated to '${status}'`,
    data: booking,
  });
});

// ─────────────────────────────────────
// GET /bookings?email=
// ─────────────────────────────────────
const getBookingsByEmail = asyncHandler(async (req, res) => {

  const { email } = req.query;

  if (!email) {
    throw new AppError(
      "Query parameter 'email' is required",
      400
    );
  }

  const bookings = await Booking.find({
    clientEmail: email.toLowerCase(),
  })
    .populate(
      "expert",
      "name email domain profileImage sessionRate"
    )
    .sort({ createdAt: -1 })
    .select("-__v");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

module.exports = {
  createBooking,
  updateBookingStatus,
  getBookingsByEmail,
};