const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const categories = [
    {
        id: 1,
        name: 'Chicken',
        description: 'Our famous fried chicken',
        image: '/images/categories/chicken.png'
    },
    {
        id: 2,
        name: 'Burgers',
        description: 'Delicious burgers with our special sauce',
        image: '/images/categories/burgers.png'
    },
    {
        id: 3,
        name: 'Snacks',
        description: 'Perfect snacks for any time',
        image: '/images/categories/snacks.png'
    }
];

const deals = [
    {
        id: 1,
        name: 'Family Feast',
        description: 'Perfect for family gatherings',
        price: 49.99,
        image: '/images/deals/family-feast.png'
    },
    {
        id: 2,
        name: 'Duo Box',
        description: 'Great for two people',
        price: 29.99,
        image: '/images/deals/duo-box.png'
    }
];

// Home page route
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().limit(10);
        res.render('index', {
            title: 'KFC - Home',
            products,
            categories,
            deals,
            bestsellers: products.slice(0, 3),
            user: req.session.user
        });
    } catch (err) {
        res.status(500).render('error', { message: 'Error loading products', error: err, status: 500 });
    }
});

// Menu page - GET
router.get('/menu', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('menu', {
            title: 'Menu',
            products,
            user: req.session.user
        });
    } catch (err) {
        res.status(500).render('error', { message: 'Error loading menu', error: err, status: 500 });
    }
});

// Menu page - POST (for adding to cart)
router.post('/menu', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Initialize cart if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = [];
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

        res.redirect('/cart');
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ message: 'Error adding to cart' });
    }
});

// About page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
        user: req.session.user
    });
});

// Contact page route
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'KFC - Contact Us',
        user: req.session.user
    });
});

// Newsletter subscription
router.post('/subscribe', (req, res) => {
    const { email } = req.body;
    // Add newsletter subscription logic here
    res.json({ success: true, message: 'Successfully subscribed!' });
});

// Product details
router.get('/menu/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            const error = new Error('Product not found');
            error.status = 404;
            return next(error);
        }
        res.render('product', {
            title: product.title,
            product,
            user: req.session.user
        });
    } catch (err) {
        next(err);
    }
});

// Category page
router.get('/category/:id', (req, res, next) => {
    const category = categories.find(c => c.id === parseInt(req.params.id));
    if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        return next(error);
    }
    res.render('category', {
        title: category.name,
        category,
        products: [],
        user: req.session.user
    });
});

module.exports = router; 