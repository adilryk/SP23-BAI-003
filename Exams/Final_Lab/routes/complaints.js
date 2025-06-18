const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Order = require('../models/Order');

// Middleware: Only logged-in users
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// Middleware: Only admin
function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }
    next();
}

// GET /complaints/new - Show complaint form
router.get('/new', requireLogin, async (req, res) => {
    const orders = await Order.find({ user: req.session.user._id });
    res.render('complaints/new', { user: req.session.user, orders });
});

// POST /complaints - Submit complaint
router.post('/', requireLogin, async (req, res) => {
    const { orderId, message } = req.body;
    if (!orderId || !message) {
        const orders = await Order.find({ user: req.session.user._id });
        return res.render('complaints/new', { user: req.session.user, orders, error: 'All fields are required.' });
    }
    await Complaint.create({
        userId: req.session.user._id,
        orderId,
        message,
        timestamp: new Date()
    });
    const orders = await Order.find({ user: req.session.user._id });
    res.render('complaints/new', { user: req.session.user, orders, success: 'Complaint submitted successfully!' });
});

// GET /complaints - List user's complaints
router.get('/', requireLogin, async (req, res) => {
    const complaints = await Complaint.find({ userId: req.session.user._id }).sort({ timestamp: -1 });
    res.render('complaints/index', { user: req.session.user, complaints });
});

// GET /complaints/admin - Admin view all complaints
router.get('/admin', requireAdmin, async (req, res) => {
    const complaints = await Complaint.find().populate('userId').sort({ timestamp: -1 });
    res.render('admin/complaints', { user: req.session.user, complaints });
});

// Show the complaint form
router.get('/new', (req, res) => {
  res.render('complaints/new');
});

// Handle complaint submission
router.post('/new', async (req, res) => {
  const { name, email, happened, solution } = req.body;
  if (!name || !email || !happened) {
    return res.render('complaints/new', { error: 'Please fill in all required fields.' });
  }
  try {
    const complaint = await Complaint.create({
      name,
      email,
      message: happened,
      solution,
      timestamp: new Date()
    });
    res.render('complaints/new', { success: true, ticketId: complaint._id });
  } catch (err) {
    res.render('complaints/new', { error: 'There was an error submitting your complaint. Please try again.' });
  }
});

// User view: list all complaints by this email
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.render('complaints/index', { complaints: null, error: 'Please provide your email to view your complaints.' });
  }
  const complaints = await Complaint.find({ email }).sort({ timestamp: -1 });
  res.render('complaints/index', { complaints, error: null });
});

// Admin view: list all complaints
router.get('/admin', async (req, res) => {
  const complaints = await Complaint.find().sort({ timestamp: -1 });
  res.render('admin/complaints', { complaints });
});

module.exports = router; 