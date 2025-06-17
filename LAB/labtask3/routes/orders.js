const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isAuthenticated } = require('../middleware/auth');

// Get user's orders
router.get('/myorders', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        
        // Get order preview from session if it exists
        const orderPreview = req.session.orderPreview;
        
        res.render('orders/my-orders', {
            orders,
            orderPreview,
            user: req.session.user,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });

        // Clear order preview after displaying
        if (orderPreview) {
            delete req.session.orderPreview;
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        req.flash('error', 'Error fetching your orders. Please try again later.');
        res.redirect('/');
    }
});

// Get single order details
router.get('/myorders/:orderId', isAuthenticated, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.session.user.id
        }).populate('items.product');

        if (!order) {
            req.flash('error', 'Order not found');
            return res.redirect('/order/myorders');
        }

        res.render('orders/order-details', {
            order,
            user: req.session.user,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        req.flash('error', 'Error fetching order details. Please try again later.');
        res.redirect('/order/myorders');
    }
});

module.exports = router; 