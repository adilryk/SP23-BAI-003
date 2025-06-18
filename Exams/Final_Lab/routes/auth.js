const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isNotAuthenticated } = require('../middleware/auth');

// Middleware to parse JSON bodies
router.use(express.json());

// Render register form
router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('auth/register', { 
        error: req.flash('error'),
        success: req.flash('success'),
        user: req.session.user,
        formData: req.flash('formData')[0] || {}
    });
});

// Render login form
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('auth/login', { 
        error: req.flash('error'),
        success: req.flash('success'),
        user: req.session.user,
        formData: req.flash('formData')[0] || {}
    });
});

// Register route
router.post('/register', isNotAuthenticated, async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        console.log('Registration attempt for email:', email);

        // Store form data in case of error
        const formData = { name, email };

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            console.log('Missing required fields');
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            req.flash('error', 'All fields are required');
            req.flash('formData', formData);
            return res.redirect('/auth/register');
        }

        // Name validation
        if (name.length < 2) {
            console.log('Name too short:', name);
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(400).json({ error: 'Name must be at least 2 characters long' });
            }
            req.flash('error', 'Name must be at least 2 characters long');
            req.flash('formData', formData);
            return res.redirect('/auth/register');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(400).json({ error: 'Please enter a valid email address' });
            }
            req.flash('error', 'Please enter a valid email address');
            req.flash('formData', formData);
            return res.redirect('/auth/register');
        }

        // Password validation
        if (password.length < 6) {
            console.log('Password too short');
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long' });
            }
            req.flash('error', 'Password must be at least 6 characters long');
            req.flash('formData', formData);
            return res.redirect('/auth/register');
        }

        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(400).json({ error: 'Passwords do not match' });
            }
            req.flash('error', 'Passwords do not match');
            req.flash('formData', formData);
            return res.redirect('/auth/register');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('User already exists:', email);
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            req.flash('error', 'Email already registered');
            req.flash('formData', formData);
            return res.redirect('/auth/register');
        }

        console.log('Creating new user:', email);
        // Create new user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        await user.save();
        console.log('User saved successfully:', email);

        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.json({ 
                success: true, 
                message: 'Registration successful! Please login.',
                redirect: '/auth/login'
            });
        }

        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific MongoDB errors
        let errorMessage = 'Error during registration. Please try again.';
        if (error.code === 11000) {
            console.log('Duplicate key error:', error);
            errorMessage = 'Email already registered';
        } else if (error.name === 'ValidationError') {
            console.log('Validation error:', error);
            const messages = Object.values(error.errors).map(err => err.message);
            errorMessage = messages.join(', ');
        } else {
            console.log('Unknown error:', error);
        }

        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.status(500).json({ error: errorMessage });
        }
        
        req.flash('error', errorMessage);
        req.flash('formData', { name: req.body.name, email: req.body.email });
        res.redirect('/auth/register');
    }
});

// Login route
router.post('/login', isNotAuthenticated, async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Validation
        if (!email || !password) {
            console.log('Missing email or password');
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            req.flash('error', 'Email and password are required');
            req.flash('formData', { email });
            return res.redirect('/auth/login');
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('User not found for email:', email);
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(401).json({ error: 'No account found with this email. Please register first.' });
            }
            req.flash('error', 'No account found with this email. Please register first.');
            req.flash('formData', { email });
            return res.redirect('/auth/login');
        }

        console.log('User found, comparing password');
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            console.log('Invalid password for user:', email);
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(401).json({ error: 'Incorrect password. Please try again.' });
            }
            req.flash('error', 'Incorrect password. Please try again.');
            req.flash('formData', { email });
            return res.redirect('/auth/login');
        }

        console.log('Login successful for user:', email);
        // Set user session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.json({ 
                success: true, 
                message: 'Welcome back!',
                redirect: '/'
            });
        }

        req.flash('success', 'Welcome back!');
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.status(500).json({ error: 'Error during login. Please try again.' });
        }
        req.flash('error', 'Error during login. Please try again.');
        req.flash('formData', { email: req.body.email });
        res.redirect('/auth/login');
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.redirect('/auth/login');
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

// Test route to verify user existence (for debugging)
router.get('/test/user/:email', async (req, res) => {
    try {
        const email = req.params.email.toLowerCase();
        const user = await User.findOne({ email });
        
        if (user) {
            res.json({
                exists: true,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            });
        } else {
            res.json({
                exists: false,
                message: 'No user found with this email'
            });
        }
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).json({
            error: 'Error checking user existence',
            details: error.message
        });
    }
});

// Test route to verify registration process
router.post('/test/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists',
                user: {
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    createdAt: existingUser.createdAt
                }
            });
        }

        // Create new user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        await user.save();

        res.json({
            success: true,
            message: 'User registered successfully',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Test registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Error during test registration',
            details: error.message
        });
    }
});

module.exports = router; 