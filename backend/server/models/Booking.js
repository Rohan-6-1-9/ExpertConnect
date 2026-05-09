const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: [true, "Expert reference is required"],
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Slot ID is required"],
    },
    slotDate: {
      type: String, // "YYYY-MM-DD"
      required: [true, "Slot date is required"],
    },
    slotTime: {
      type: String, // "HH:MM"
      required: [true, "Slot time is required"],
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, "Client email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    clientPhone: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    sessionLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─────────────────────────────────────────────
// COMPOUND UNIQUE INDEX — prevents double booking
// Same expert cannot have two bookings for the same slot
// ─────────────────────────────────────────────
bookingSchema.index(
  { expert: 1, slotDate: 1, slotTime: 1 },
  {
    unique: true,
    name: "prevent_double_booking",
  }
);

// Also index by clientEmail for fast lookup
bookingSchema.index({ clientEmail: 1 });

module.exports = mongoose.model("Booking", bookingSchema);