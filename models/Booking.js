const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  date: String,
  timeSlot: String
});

module.exports = mongoose.model('Booking', bookingSchema);

