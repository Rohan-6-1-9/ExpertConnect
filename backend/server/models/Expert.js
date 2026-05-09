const mongoose = require("mongoose");

const availableSlotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: "YYYY-MM-DD"
      required: true,
    },
    time: {
      type: String, // Format: "HH:MM"
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Expert name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Expert email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    domain: {
      type: String,
      required: [true, "Domain/expertise area is required"],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    profileImage: {
      type: String,
      default: "https://ui-avatars.com/api/?background=random",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    sessionRate: {
      type: Number, // in USD per hour
      required: [true, "Session rate is required"],
      min: 0,
    },
    availableSlots: [availableSlotSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: count of free slots
expertSchema.virtual("freeSlotCount").get(function () {
  const slots = this.availableSlots || []

  return slots.filter(
    (s) => !s.isBooked
  ).length
})

module.exports = mongoose.model("Expert", expertSchema);