const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const isAdmin = require('../middleware/adminAuth');

// Apply admin middleware to all routes
router.use(isAdmin);

// Admin dashboard
router.get('/', async (req, res) => {
    try {
        const [productCount, orderCount, recentOrders] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            Order.find()
                .populate('user', 'name email')
                .sort('-createdAt')
                .limit(5)
                .lean()
        ]);

        res.render('admin/dashboard', { 
            productCount, 
            orderCount,
            recentOrders: recentOrders || [],
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        req.flash('error', 'Error loading dashboard');
        res.status(500).render('error', { 
            message: 'Error loading dashboard',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Product Management Routes
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort('-createdAt');
        res.render('admin/products', { 
            products,
            categories: ['Burgers', 'Chicken', 'Sides', 'Drinks', 'Desserts'],
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading products');
        res.status(500).render('error', { message: error.message });
    }
});

router.get('/products/add', (req, res) => {
    res.render('admin/product-form', {
        categories: ['Burgers', 'Chicken', 'Sides', 'Drinks', 'Desserts'],
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
});

router.post('/products/add', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        req.flash('success', 'Product added successfully');
        res.redirect('/admin/products');
    } catch (error) {
        req.flash('error', error.message);
        res.status(400).render('admin/product-form', { 
            error: error.message,
            product: req.body,
            categories: ['Burgers', 'Chicken', 'Sides', 'Drinks', 'Desserts'],
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    }
});

router.get('/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/admin/products');
        }
        res.render('admin/product-form', { 
            product,
            categories: ['Burgers', 'Chicken', 'Sides', 'Drinks', 'Desserts'],
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading product');
        res.status(404).render('error', { message: 'Product not found' });
    }
});

router.post('/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/admin/products');
        }
        req.flash('success', 'Product updated successfully');
        res.redirect('/admin/products');
    } catch (error) {
        req.flash('error', error.message);
        res.status(400).render('admin/product-form', { 
            error: error.message,
            product: req.body,
            categories: ['Burgers', 'Chicken', 'Sides', 'Drinks', 'Desserts'],
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    }
});

router.post('/products/delete/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found');
        } else {
            req.flash('success', 'Product deleted successfully');
        }
        res.redirect('/admin/products');
    } catch (error) {
        req.flash('error', 'Error deleting product');
        res.status(500).render('error', { message: error.message });
    }
});

// Order Management Routes
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort('-createdAt');
        res.render('admin/orders', { 
            orders,
            statuses: ['pending', 'processing', 'completed', 'cancelled'],
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading orders');
        res.status(500).render('error', { message: error.message });
    }
});

router.post('/orders/:id/status', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) {
            req.flash('error', 'Order not found');
        } else {
            req.flash('success', 'Order status updated successfully');
        }
        res.redirect('/admin/orders');
    } catch (error) {
        req.flash('error', 'Error updating order status');
        res.status(500).render('error', { message: error.message });
    }
});

module.exports = router; 