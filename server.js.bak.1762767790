// server.js — Box Cricket Backend (Final Production Version)
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/boxcricket";
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Booking Schema & Model
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

// Health check
app.get("/healthz", (req, res) => res.status(200).json({ ok: true }));

// Root route
app.get("/", (req, res) => res.send("🏏 Box Cricket Backend is Running..."));

// Create a new booking
app.post("/book", async (req, res) => {
  try {
    const { name, mobile, date, time } = req.body;
    if (!name || !mobile || !date || !time)
      return res.status(400).json({ error: "Missing required fields" });

    const existing = await Booking.findOne({ date, time });
    if (existing)
      return res.status(400).json({ error: "Time slot already booked" });

    const booking = new Booking({ name, mobile, date, time });
    await booking.save();
    return res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    return res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Serve frontend (SPA build fallback)
const frontBuildPath = path.join(__dirname, "..", "cricket-frontend", "build");
if (fs.existsSync(frontBuildPath)) {
  app.use(express.static(frontBuildPath));
  app.use((req, res, next) => {
    if (req.method !== "GET" || !req.accepts("html")) return next();
    const indexFile = path.join(frontBuildPath, "index.html");
    if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
    next();
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
