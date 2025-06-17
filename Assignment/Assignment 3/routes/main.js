const express = require('express');
const router = express.Router();

// Sample data for the website
const products = [
    {
        id: 1,
        name: 'Chicken Bucket',
        description: '8 pieces of our famous fried chicken',
        price: 24.99,
        image: '/images/products/chicken-bucket.png'
    },
    {
        id: 2,
        name: 'Zinger Stacker',
        description: 'Double chicken fillet with cheese and special sauce',
        price: 8.99,
        image: '/images/products/zinger-stacker.png'
    },
    {
        id: 3,
        name: 'Hot Wings',
        description: '8 pieces of spicy wings',
        price: 12.99,
        image: '/images/products/hot-wings.png'
    }
];

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
router.get('/', (req, res) => {
    res.render('index', {
        title: 'KFC - Home',
        products,
        categories,
        deals,
        bestsellers: products.slice(0, 3) // Using first 3 products as bestsellers
    });
});

// Menu page
router.get('/menu', (req, res) => {
    res.render('menu', {
        title: 'Menu',
        products
    });
});

// About page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us'
    });
});

// Contact page route
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'KFC - Contact Us'
    });
});

// Newsletter subscription
router.post('/subscribe', (req, res) => {
    const { email } = req.body;
    // Add newsletter subscription logic here
    res.json({ success: true, message: 'Successfully subscribed!' });
});

// Product details
router.get('/menu/:id', (req, res, next) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        return next(error);
    }
    res.render('product', {
        title: product.name,
        product
    });
});

// Category page
router.get('/category/:id', (req, res, next) => {
    const category = categories.find(c => c.id === parseInt(req.params.id));
    if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        return next(error);
    }
    const categoryProducts = products.filter(p => p.categoryId === category.id);
    res.render('category', {
        title: category.name,
        category,
        products: categoryProducts
    });
});

module.exports = router; 