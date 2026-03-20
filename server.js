const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 1000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/boxcricket")
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => console.error("🔴 MongoDB Error:", err));

const bookingSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true },
    mobile: { type: String, required: true },
    date:   { type: String, required: true },
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

/* ── Health ── */
app.get("/health", (req, res) => res.json({ ok: true }));

/* ── PUBLIC: Get all bookings ── */
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/* ── PUBLIC: Create booking ── */
app.post("/bookings", async (req, res) => {
  try {
    const { name, mobile, date, startTime, endTime } = req.body;

    if (!name || !mobile || !date || !startTime || !endTime)
      return res.status(400).json({ error: "All fields required" });

    // Check overlap: any booking on same date where times overlap
    const existing = await Booking.findOne({
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (existing)
      return res.status(400).json({
        error: `Slot conflicts with existing booking (${existing.startTime}–${existing.endTime})`
      });

    const booking = new Booking({ name, mobile, date, startTime, endTime });
    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ── ADMIN AUTH ── */
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"] || req.query.admin_key;
  const ADMIN_KEY = process.env.ADMIN_KEY;
  if (!ADMIN_KEY) return res.status(401).json({ error: "Admin key not configured" });
  if (key !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  next();
}

/* ── ADMIN: Get all bookings ── */
app.get("/admin/bookings", adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

/* ── ADMIN: Update booking ── */
app.put("/admin/bookings/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Updated", booking: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

/* ── ADMIN: Delete booking ── */
app.delete("/admin/bookings/:id", adminAuth, async (req, res) => {
  try {
    const removed = await Booking.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
