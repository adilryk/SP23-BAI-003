const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { isAuthenticated } = require('../middleware/auth');

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        req.session.error = 'Please login to access this page';
        return res.redirect('/auth/login');
    }
    next();
};

// Middleware to initialize cart
const initCart = (req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
};

// Get cart page
router.get('/', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart/index', { 
        cart,
        user: req.session.user,
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
});

// Add item to cart
router.post('/add', (req, res) => {
    const { productId, name, price, quantity } = req.body;
    let cart = req.session.cart || [];

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.push({
            productId,
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        });
    }

    req.session.cart = cart;
    req.flash('success', 'Item added to cart');
    res.redirect('/cart');
});

// Update cart item quantity
router.post('/update', (req, res) => {
    const { productId, quantity } = req.body;
    let cart = req.session.cart || [];

    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.productId !== productId);
        }
    }

    req.session.cart = cart;
    res.redirect('/cart');
});

// Remove item from cart
router.post('/remove', (req, res) => {
    const { productId } = req.body;
    let cart = req.session.cart || [];

    cart = cart.filter(item => item.productId !== productId);
    req.session.cart = cart;
    req.flash('success', 'Item removed from cart');
    res.redirect('/cart');
});

// Checkout process
router.post('/checkout', isAuthenticated, async (req, res) => {
    try {
        const cart = req.session.cart || [];
        
        if (cart.length === 0) {
            req.flash('error', 'Your cart is empty');
            return res.redirect('/cart');
        }

        // Calculate total amount
        const totalAmount = cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Create order preview
        const orderPreview = {
            items: cart.map(item => ({
                product: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity
            })),
            totalAmount: totalAmount,
            status: 'pending',
            createdAt: new Date()
        };

        // Save order preview to session
        req.session.orderPreview = orderPreview;

        // Create actual order in database
        const order = new Order({
            user: req.session.user.id,
            items: cart.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: totalAmount,
            status: 'pending'
        });

        await order.save();

        // Clear cart after successful order
        req.session.cart = [];
        req.flash('success', 'Order placed successfully!');
        res.redirect('/order/myorders');
    } catch (error) {
        console.error('Checkout error:', error);
        req.flash('error', 'Error processing your order');
        res.redirect('/cart');
    }
});

module.exports = router; 