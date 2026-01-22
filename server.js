const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =====================
   MongoDB Connection
===================== */
const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/boxcricket";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

/* =====================
   Booking Schema
===================== */
const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

/* =====================
   Health Check
===================== */
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

/* =====================
   Time Validation (5AM–12AM)
===================== */
function isWithinBookingHours(timeStr) {
  const match = timeStr.match(/(\d+)(?::\d+)?\s*(AM|PM)/i);
  if (!match) return false;

  let hour = parseInt(match[1], 10);
  const period = match[2].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour >= 5 && hour < 24;
}

/* =====================
   CREATE BOOKING
===================== */
app.post("/book", async (req, res) => {
  try {
    const { name, mobile, date, time } = req.body;

    if (!isWithinBookingHours(time)) {
      return res
        .status(400)
        .json({ error: "Bookings allowed only between 5 AM and 12 AM" });
    }

    const existing = await Booking.findOne({ date, time });
    if (existing) {
      return res.status(400).json({ error: "Time slot already booked" });
    }

    const booking = new Booking({ name, mobile, date, time });
    await booking.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================
   PUBLIC BOOKINGS
===================== */
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/* =====================
   ADMIN AUTH
===================== */
function adminAuth(req, res, next) {
  const key = req.header("x-admin-key") || req.query.admin_key;
  const ADMIN_KEY = process.env.ADMIN_KEY;

  if (!ADMIN_KEY) {
    return res.status(401).json({ error: "Admin key not configured" });
  }
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/* =====================
   ADMIN ROUTES
===================== */

// Get all bookings
app.get("/admin/bookings", adminAuth, async (req, res) => {
  const bookings = await Booking.find().sort({ date: 1, time: 1 });
  res.json(bookings);
});

// Update booking
app.put("/admin/bookings/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Updated", booking: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// Delete booking
app.delete("/admin/bookings/:id", adminAuth, async (req, res) => {
  try {
    const removed = await Booking.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

/* =====================
   START SERVER
===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
