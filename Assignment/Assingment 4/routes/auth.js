const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Render register form
router.get('/register', (req, res) => {
    res.render('auth/register', { error: undefined, user: req.session.user });
});

// Render login form
router.get('/login', (req, res) => {
    res.render('auth/login', { error: undefined, user: req.session.user });
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.render('auth/register', { error: 'All fields are required', user: undefined });
        }
        if (password !== confirmPassword) {
            return res.render('auth/register', { error: 'Passwords do not match', user: undefined });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/register', { error: 'Email already registered', user: undefined });
        }
        const user = new User({ name, email, password });
        await user.save();
        req.session.user = { id: user._id, name: user.name, email: user.email };
        res.redirect('/');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', { error: 'Error during registration', user: undefined });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('auth/login', { error: 'Email and password are required', user: undefined });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/login', { error: 'Invalid email or password', user: undefined });
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.render('auth/login', { error: 'Invalid email or password', user: undefined });
        }
        req.session.user = { id: user._id, name: user.name, email: user.email };
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', { error: 'Error during login', user: undefined });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

// Get current user
router.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

module.exports = router; 