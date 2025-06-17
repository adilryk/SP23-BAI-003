const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get menu page
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('menu/index', {
            products,
            user: req.session.user,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
        req.flash('error', 'Error loading menu');
        res.redirect('/');
    }
});

// Get product details
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/menu');
        }
        res.render('menu/product-details', {
            product,
            user: req.session.user,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        req.flash('error', 'Error loading product details');
        res.redirect('/menu');
    }
});

module.exports = router; 