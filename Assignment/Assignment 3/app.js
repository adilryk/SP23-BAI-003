const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Middleware
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Flash messages
app.use(flash());

// Global variables middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.messages = {
        error: req.flash('error'),
        success: req.flash('success')
    };
    next();
});

// Sample data (replace with database in production)
const products = [
    {
        id: 1,
        name: 'Chicken Bucket',
        image: '/images/chicken-bucket.jpg',
        price: 1299
    },
    {
        id: 2,
        name: 'Zinger Burger',
        image: '/images/zinger-burger.jpg',
        price: 399
    },
    {
        id: 3,
        name: 'Chicken Wings',
        image: '/images/chicken-wings.jpg',
        price: 599
    },
    {
        id: 4,
        name: 'Chicken Popcorn',
        image: '/images/chicken-popcorn.jpg',
        price: 299
    }
];

const bestsellers = [
    {
        id: 1,
        name: 'Chicken Bucket',
        image: '/images/chicken-bucket.jpg',
        price: 1299
    },
    {
        id: 2,
        name: 'Zinger Burger',
        image: '/images/zinger-burger.jpg',
        price: 399
    }
];

const deals = [
    {
        id: 1,
        name: 'Family Feast',
        image: '/images/family-feast.jpg',
        description: 'Perfect for family gatherings',
        price: 1999
    },
    {
        id: 2,
        name: 'Lunch Special',
        image: '/images/lunch-special.jpg',
        description: 'Great value lunch combo',
        price: 499
    }
];

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.render('index', {
        products,
        bestsellers,
        deals,
        user: req.session.user || null,
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 