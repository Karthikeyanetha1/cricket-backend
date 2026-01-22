// admin-routes.js
// Admin CRUD routes secured using ADMIN_KEY

const express = require("express");
const router = express.Router();

// Admin authentication middleware
function adminAuth(req, res, next) {
  const key =
    req.headers["x-admin-key"] ||
    req.query.admin_key;

  const ADMIN_KEY = process.env.ADMIN_KEY;

  if (!ADMIN_KEY) {
    return res.status(500).json({ error: "Admin key not configured" });
  }

  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin" });
  }

  next();
}

module.exports = (app, Booking) => {
  /* ==============================
     GET all bookings (Admin)
     ============================== */
  app.get("/admin/bookings", adminAuth, async (req, res) => {
    try {
      const bookings = await Booking.find().sort({ date: 1, time: 1 });
      res.json(bookings);
    } catch (err) {
      console.error("❌ Admin GET bookings error:", err);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  /* ==============================
     UPDATE booking (Admin)
     ============================== */
  app.put("/admin/bookings/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, mobile, date, time } = req.body;

      const updated = await Booking.findByIdAndUpdate(
        id,
        { name, mobile, date, time },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json({ message: "Booking updated", booking: updated });
    } catch (err) {
      console.error("❌ Admin UPDATE booking error:", err);
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  /* ==============================
     DELETE booking (Admin)
     ============================== */
  app.delete("/admin/bookings/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await Booking.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json({ message: "Booking deleted successfully" });
    } catch (err) {
      console.error("❌ Admin DELETE booking error:", err);
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  return router;
};
