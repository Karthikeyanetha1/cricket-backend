const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://Boxcricketadmin:Boxcricket123@boxcricketdb.vzawekj.mongodb.net/boxcricket?retryWrites=true&w=majority&appName=BoxCricketDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Define Booking Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  date: String,
  time: String,
});

// ✅ Create Booking Model
const Booking = mongoose.model('Booking', bookingSchema);

// ✅ POST /book - Save a new booking
app.post('/book', async (req, res) => {
  try {
    const { name, mobile, date, time } = req.body;

    // Check if the time slot is already booked
    const existing = await Booking.findOne({ date, time });
    if (existing) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    const booking = new Booking({ name, mobile, date, time });
    await booking.save();
    res.json({ message: 'Booking successful' });
  } catch (err) {
    console.error('❌ Error saving booking:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET /bookings - Retrieve all bookings
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ✅ Start the Server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
