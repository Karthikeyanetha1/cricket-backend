/**
 * admin-routes.js
 * Adds admin CRUD routes and notify (email/sms). Uses ADMIN_KEY header/query for auth.
 */
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
let twilioClient = null;
try {
  const twilio = require('twilio');
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (e) {
  // optional
}

module.exports = (app, Booking) => {
  // admin auth middleware
  function adminAuth(req, res, next) {
    const key = req.header('x-admin-key') || req.query.admin_key;
    const ADMIN_KEY = process.env.ADMIN_KEY || '';
    if (!ADMIN_KEY) return res.status(401).json({ error: 'Admin not configured' });
    if (!key || key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
    next();
  }

  // list bookings
  app.get('/admin/bookings', adminAuth, async (req, res) => {
    try {
      const bookings = await Booking.find().sort({ date: 1, time: 1 });
      res.json(bookings);
    } catch (err) {
      console.error('Admin GET bookings error', err);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  // update booking
  app.put('/admin/bookings/:id', adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, mobile, date, time } = req.body;
      const updated = await Booking.findByIdAndUpdate(id, { name, mobile, date, time }, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Updated', booking: updated });
    } catch (err) {
      console.error('Admin PUT booking error', err);
      res.status(500).json({ error: 'Failed to update' });
    }
  });

  // delete booking
  app.delete('/admin/bookings/:id', adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const removed = await Booking.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted', booking: removed });
    } catch (err) {
      console.error('Admin DELETE booking error', err);
      res.status(500).json({ error: 'Failed to delete' });
    }
  });

  // email notify
  app.post('/admin/notify/email', adminAuth, async (req, res) => {
    try {
      const { to, subject, text, html } = req.body;
      if (!to || (!text && !html)) return res.status(400).json({ error: 'Missing to/text/html' });

      // create transporter from env
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: (process.env.EMAIL_SECURE === 'true'),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to, subject: subject || 'Booking Notification', text, html
      });
      res.json({ message: 'Email sent', info: info && info.messageId ? info.messageId : info });
    } catch (err) {
      console.error('Admin EMAIL error', err);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // sms notify (twilio)
  app.post('/admin/notify/sms', adminAuth, async (req, res) => {
    try {
      const { to, body } = req.body;
      if (!to || !body) return res.status(400).json({ error: 'Missing to/body' });
      if (!twilioClient) return res.status(500).json({ error: 'Twilio not configured' });

      const msg = await twilioClient.messages.create({
        body,
        from: process.env.TWILIO_FROM,
        to
      });
      res.json({ message: 'SMS sent', sid: msg.sid });
    } catch (err) {
      console.error('Admin SMS error', err);
      res.status(500).json({ error: 'Failed to send SMS' });
    }
  });

  return router;
};
