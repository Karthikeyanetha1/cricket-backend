const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use MONGO_URI from env (Render) or a local fallback
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/boxcricket";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Booking schema and model
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

// API routes
app.get("/", (req, res) => {
  res.send("Box Cricket Backend is Running...");
});

app.post("/book", async (req, res) => {
  try {
    const { name, mobile, date, time } = req.body;
    if (!name || !mobile || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existing = await Booking.findOne({ date, time });
    if (existing) {
      return res.status(400).json({ error: "Time slot already booked" });
    }
    const booking = new Booking({ name, mobile, date, time });
    await booking.save();
    return res.json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    return res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/*
  Static frontend serving:
  - serve the built frontend (if present).
  - fallback middleware below serves index.html only for browser HTML GET requests
    that are not API/static requests. This avoids path-to-regexp wildcard issues.
*/
const frontendBuildPath = path.resolve(__dirname, "..", "cricket-frontend", "build");
app.use(express.static(frontendBuildPath));

// Fallback: for GET requests that accept HTML and are NOT API/static requests,
// send index.html. This avoids registering a wildcard route that path-to-regexp may parse.
app.use((req, res, next) => {
  // only handle simple browser GET requests
  if (req.method !== "GET") return next();

  // if request expects HTML (browser navigation)
  if (!req.accepts || !req.accepts("html")) return next();

  const urlPath = (req.path || "").toLowerCase();

  // don't rewrite API routes or static assets
  if (
    urlPath.startsWith("/book") ||
    urlPath.startsWith("/bookings") ||
    urlPath.startsWith("/static") ||
    urlPath.startsWith("/api") // in case you add /api later
  ) {
    return next();
  }

  // send index.html if it exists in build
  const indexFile = path.join(frontendBuildPath, "index.html");
  return res.sendFile(indexFile, (err) => {
    if (err) next(err);
  });
});

// Listen on Render-assigned port (or local fallback)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
