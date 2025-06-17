require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        title: 'Original Recipe Chicken',
        price: 12.99,
        description: 'Our world-famous Original Recipe chicken, made with our secret blend of 11 herbs and spices.',
        image: '/images/products/original-chicken.jpg'
    },
    {
        title: 'Zinger Burger',
        price: 8.99,
        description: 'A spicy chicken fillet topped with fresh lettuce and creamy mayo in a soft bun.',
        image: '/images/products/zinger-burger.jpg'
    },
    {
        title: 'Popcorn Chicken',
        price: 6.99,
        description: 'Bite-sized pieces of tender chicken, perfect for snacking.',
        image: '/images/products/popcorn-chicken.jpg'
    },
    {
        title: 'Chicken Wings',
        price: 9.99,
        description: '8 pieces of our famous chicken wings, available in various flavors.',
        image: '/images/products/chicken-wings.jpg'
    },
    {
        title: 'Chicken Bucket',
        price: 24.99,
        description: 'A bucket of our Original Recipe chicken, perfect for sharing.',
        image: '/images/products/chicken-bucket.jpg'
    }
];

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Insert new products
        await Product.insertMany(products);
        console.log('Added sample products');
        
        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
}); 