const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      isActive: true,
      address: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' }
    });

    console.log('Users created');

    // Create Products
    const products = await Product.insertMany([
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and exceptional sound quality.',
        price: 299.99, originalPrice: 399.99,
        category: 'Electronics', brand: 'SoundPro',
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', alt: 'Headphones' }],
        stock: 50, sku: 'SPH-001', ratings: 4.5, numReviews: 128, isFeatured: true,
        tags: ['wireless', 'headphones', 'audio'], createdBy: admin._id
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB mechanical keyboard with Cherry MX switches, anti-ghosting, and programmable macros.',
        price: 149.99, originalPrice: 199.99,
        category: 'Electronics', brand: 'TechPro',
        images: [{ url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', alt: 'Keyboard' }],
        stock: 35, sku: 'TPK-001', ratings: 4.3, numReviews: 89, isFeatured: true,
        tags: ['gaming', 'keyboard', 'mechanical'], createdBy: admin._id
      },
      {
        name: '4K Ultra HD Smart TV - 55"',
        description: 'Crystal clear 4K display with HDR10+, built-in streaming apps, and voice control.',
        price: 699.99, originalPrice: 899.99,
        category: 'Electronics', brand: 'VisionTech',
        images: [{ url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400', alt: 'Smart TV' }],
        stock: 20, sku: 'VT-TV55', ratings: 4.6, numReviews: 215, isFeatured: true,
        tags: ['tv', '4k', 'smart-tv'], createdBy: admin._id
      },
      {
        name: 'Men\'s Premium Cotton T-Shirt',
        description: 'Soft, breathable 100% organic cotton tee. Available in multiple colors.',
        price: 29.99, originalPrice: 39.99,
        category: 'Clothing', brand: 'ComfortWear',
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'T-Shirt' }],
        stock: 200, sku: 'CW-TS-M', ratings: 4.2, numReviews: 342,
        tags: ['clothing', 'men', 'cotton'], createdBy: admin._id
      },
      {
        name: 'Women\'s Running Shoes',
        description: 'Lightweight performance running shoes with cushioned sole and breathable mesh upper.',
        price: 89.99, originalPrice: 120.00,
        category: 'Sports', brand: 'RunFast',
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', alt: 'Running Shoes' }],
        stock: 80, sku: 'RF-WRS-01', ratings: 4.7, numReviews: 456, isFeatured: true,
        tags: ['shoes', 'running', 'women'], createdBy: admin._id
      },
      {
        name: 'JavaScript: The Definitive Guide',
        description: 'Comprehensive guide to JavaScript programming for beginners and professionals alike.',
        price: 49.99, originalPrice: 65.00,
        category: 'Books', brand: "O'Reilly",
        images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', alt: 'Book' }],
        stock: 100, sku: 'BK-JS-001', ratings: 4.8, numReviews: 672,
        tags: ['book', 'javascript', 'programming'], createdBy: admin._id
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated 32oz bottle keeps drinks cold 24h or hot 12h. BPA-free, leak-proof.',
        price: 34.99, originalPrice: 45.00,
        category: 'Sports', brand: 'HydroLife',
        images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', alt: 'Water Bottle' }],
        stock: 150, sku: 'HL-WB-32', ratings: 4.4, numReviews: 234,
        tags: ['bottle', 'hydration', 'eco'], createdBy: admin._id
      },
      {
        name: 'Scented Soy Candle Set',
        description: 'Set of 3 hand-poured soy candles in calming lavender, vanilla, and eucalyptus scents.',
        price: 42.99, originalPrice: 55.00,
        category: 'Home & Garden', brand: 'AromaBliss',
        images: [{ url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400', alt: 'Candles' }],
        stock: 75, sku: 'AB-CS-03', ratings: 4.9, numReviews: 189, isFeatured: true,
        tags: ['candle', 'home', 'aromatherapy'], createdBy: admin._id
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: '360° surround sound, 20h battery, waterproof IPX7 rating. Perfect for outdoors.',
        price: 79.99, originalPrice: 99.99,
        category: 'Electronics', brand: 'SoundPro',
        images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', alt: 'Speaker' }],
        stock: 60, sku: 'SP-BT-001', ratings: 4.5, numReviews: 312,
        tags: ['speaker', 'bluetooth', 'portable'], createdBy: admin._id
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip eco-friendly TPE yoga mat, 6mm thick with alignment lines and carry strap.',
        price: 54.99, originalPrice: 70.00,
        category: 'Sports', brand: 'ZenFit',
        images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', alt: 'Yoga Mat' }],
        stock: 90, sku: 'ZF-YM-01', ratings: 4.6, numReviews: 178,
        tags: ['yoga', 'fitness', 'mat'], createdBy: admin._id
      },
      {
        name: 'Air Purifier HEPA',
        description: 'True HEPA filter removes 99.97% of particles. Covers 500 sq ft, whisper-quiet.',
        price: 189.99, originalPrice: 249.99,
        category: 'Home & Garden', brand: 'CleanAir',
        images: [{ url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400', alt: 'Air Purifier' }],
        stock: 30, sku: 'CA-AP-H01', ratings: 4.7, numReviews: 95, isFeatured: true,
        tags: ['purifier', 'hepa', 'home'], createdBy: admin._id
      },
      {
        name: 'Organic Face Moisturizer',
        description: 'All-natural moisturizer with hyaluronic acid, vitamin C, and aloe vera. For all skin types.',
        price: 38.99, originalPrice: 50.00,
        category: 'Beauty', brand: 'PureSkin',
        images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', alt: 'Moisturizer' }],
        stock: 120, sku: 'PS-FM-01', ratings: 4.4, numReviews: 267,
        tags: ['skincare', 'organic', 'beauty'], createdBy: admin._id
      }
    ]);

    console.log(`${products.length} products created`);

    // Create sample orders
    await Order.create({
      user: user._id,
      items: [
        { product: products[0]._id, name: products[0].name, image: products[0].images[0].url, price: products[0].price, quantity: 1 },
        { product: products[6]._id, name: products[6].name, image: products[6].images[0].url, price: products[6].price, quantity: 2 }
      ],
      shippingAddress: { fullName: 'John Doe', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA', phone: '555-1234' },
      paymentMethod: 'credit_card',
      subtotal: 369.97, taxAmount: 36.99, shippingCost: 0, totalAmount: 406.96,
      orderStatus: 'delivered', isPaid: true, paidAt: new Date(), isDelivered: true, deliveredAt: new Date(),
      statusHistory: [
        { status: 'pending', note: 'Order placed' },
        { status: 'confirmed', note: 'Payment confirmed' },
        { status: 'shipped', note: 'Shipped via FedEx' },
        { status: 'delivered', note: 'Delivered successfully' }
      ]
    });

    await Order.create({
      user: user._id,
      items: [{ product: products[1]._id, name: products[1].name, image: products[1].images[0].url, price: products[1].price, quantity: 1 }],
      shippingAddress: { fullName: 'John Doe', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
      paymentMethod: 'paypal',
      subtotal: 149.99, taxAmount: 15.00, shippingCost: 9.99, totalAmount: 174.98,
      orderStatus: 'processing', isPaid: true, paidAt: new Date(),
      statusHistory: [{ status: 'pending', note: 'Order placed' }, { status: 'processing', note: 'Being prepared' }]
    });

    console.log('Sample orders created');

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin credentials:');
    console.log('  Email:    admin@example.com');
    console.log('  Password: admin123');
    console.log('\nUser credentials:');
    console.log('  Email:    user@example.com');
    console.log('  Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
