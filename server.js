const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== PORT FIX (IMPORTANT FOR RENDER) =====
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

// ===== ROOT ROUTE (FIX TIMEOUT ISSUE) =====
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => console.log("🔴 MongoDB Error:", err));

// ===== SCHEMA =====
const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

// ===== GET BOOKINGS =====
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      date: 1,
      startTime: 1,
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ===== CREATE BOOKING =====
app.post("/bookings", async (req, res) => {
  try {
    const { name, mobile, date, startTime, endTime } = req.body;

    if (!name || !mobile || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Overlap check
    const existing = await Booking.findOne({
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (existing) {
      return res.status(400).json({
        error: `Slot conflicts with existing booking (${existing.startTime}-${existing.endTime})`,
      });
    }

    const booking = new Booking({
      name,
      mobile,
      date,
      startTime,
      endTime,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== ADMIN AUTH =====
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"] || req.query.admin_key;
  const ADMIN_KEY = process.env.ADMIN_KEY;

  if (!ADMIN_KEY) {
    return res.status(401).json({ error: "Admin key not configured" });
  }

  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

// ===== ADMIN ROUTES =====
app.get("/admin/bookings", adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      date: 1,
      startTime: 1,
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.put("/admin/bookings/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Updated", booking: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

app.delete("/admin/bookings/:id", adminAuth, async (req, res) => {
  try {
    const removed = await Booking.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ===== START SERVER =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
