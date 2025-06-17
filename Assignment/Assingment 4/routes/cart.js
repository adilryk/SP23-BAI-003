const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

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

// View cart
router.get('/', initCart, (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.render('cart', {
        title: 'Shopping Cart',
        cart,
        total,
        user: req.session.user,
        success: req.session.success,
        error: req.session.error
    });
    
    // Clear flash messages
    delete req.session.success;
    delete req.session.error;
});

// Add to cart
router.post('/add', initCart, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) {
            req.session.error = 'Product not found';
            return res.redirect('/menu');
        }

        const cartItem = req.session.cart.find(item => item.productId === productId);
        
        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
        } else {
            req.session.cart.push({
                productId,
                title: product.title,
                price: product.price,
                quantity: parseInt(quantity)
            });
        }

        req.session.success = 'Item added to cart';
        res.redirect('/cart');
    } catch (err) {
        console.error('Error adding to cart:', err);
        req.session.error = 'Error adding item to cart';
        res.redirect('/menu');
    }
});

// Update cart item quantity
router.post('/update/:productId', initCart, (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    const cartItem = req.session.cart.find(item => item.productId === productId);
    
    if (cartItem) {
        if (parseInt(quantity) > 0) {
            cartItem.quantity = parseInt(quantity);
            req.session.success = 'Cart updated';
        } else {
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);
            req.session.success = 'Item removed from cart';
        }
    }
    
    res.redirect('/cart');
});

// Remove item from cart
router.post('/remove/:productId', initCart, (req, res) => {
    const { productId } = req.params;
    
    req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    req.session.success = 'Item removed from cart';
    
    res.redirect('/cart');
});

// Checkout page
router.get('/checkout', isLoggedIn, initCart, (req, res) => {
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
        req.session.error = 'Your cart is empty';
        return res.redirect('/cart');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.render('checkout', {
        title: 'Checkout',
        cart,
        total,
        user: req.session.user,
        error: req.session.error
    });
    
    delete req.session.error;
});

// Place order
router.post('/place-order', isLoggedIn, initCart, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const cart = req.session.cart || [];
        
        if (cart.length === 0) {
            req.session.error = 'Your cart is empty';
            return res.redirect('/cart');
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const order = new Order({
            user: {
                name,
                phone,
                address
            },
            items: cart,
            totalPrice: total
        });
        
        await order.save();
        
        // Clear cart after successful order
        req.session.cart = [];
        req.session.success = 'Order placed successfully! You can pay with cash when your order arrives.';
        
        res.redirect('/');
    } catch (err) {
        console.error('Error placing order:', err);
        req.session.error = 'Error placing order. Please try again.';
        res.redirect('/cart/checkout');
    }
});

module.exports = router; 