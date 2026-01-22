// server.js — Box Cricket Backend (Render-safe, backend-only)
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/boxcricket";
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Schema & model
const bookingSchema = new mongoose.Schema(
  { name: String, mobile: String, date: String, time: String },
  { timestamps: true }
);
const Booking = mongoose.model("Booking", bookingSchema);

// Health & root
app.get("/healthz", (req, res) => res.status(200).json({ ok: true }));
app.get("/", (_req, res) => res.send("🏏 Box Cricket Backend is Running..."));

// Create booking
app.post("/book", async (req, res) => {
  try {
    const { name, mobile, date, time } = req.body;
    if (!name || !mobile || !date || !time)
      return res.status(400).json({ error: "Missing required fields" });

    const existing = await Booking.findOne({ date, time });
    if (existing) return res.status(400).json({ error: "Time slot already booked" });

    const saved = await new Booking({ name, mobile, date, time }).save();
    res.status(201).json(saved);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// List bookings
app.get("/bookings", async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Start (Render provides PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
