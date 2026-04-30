const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

// ✅ Automatically get a valid category from model
const VALID_CATEGORY = Product.schema.path('category').enumValues[0];

const products = [
  {
    name: "iPhone 15 Pro",
    price: 135000,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
    category: VALID_CATEGORY,
    description: "Latest Apple smartphone"
  },
  {
    name: "Samsung Galaxy S23",
    price: 85000,
    image: "https://images.unsplash.com/photo-1678911820864-e4b9d6dfd84e",
    category: VALID_CATEGORY,
    description: "Samsung flagship"
  },
  {
    name: "MacBook Air M2",
    price: 120000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    category: VALID_CATEGORY,
    description: "Apple laptop"
  },
  {
    name: "Dell XPS 13",
    price: 95000,
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    category: VALID_CATEGORY,
    description: "Premium ultrabook"
  },
  {
    name: "Sony Headphones",
    price: 30000,
    image: "https://images.unsplash.com/photo-1518443895914-6c4c67b1b1b7",
    category: VALID_CATEGORY,
    description: "Noise cancelling"
  },
  {
    name: "Apple Watch",
    price: 45000,
    image: "https://images.unsplash.com/photo-1516570161787-2fd917215a3d",
    category: VALID_CATEGORY,
    description: "Smartwatch"
  },
  {
    name: "iPad Pro",
    price: 90000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
    category: VALID_CATEGORY,
    description: "Tablet"
  },
  {
    name: "JBL Speaker",
    price: 12000,
    image: "https://images.unsplash.com/photo-1585386959984-a4155223f6a8",
    category: VALID_CATEGORY,
    description: "Bluetooth speaker"
  },
  {
    name: "Canon Camera",
    price: 55000,
    image: "https://images.unsplash.com/photo-1519183071298-a2962be96a18",
    category: VALID_CATEGORY,
    description: "Photography camera"
  },
  {
    name: "Gaming Laptop",
    price: 140000,
    image: "https://images.unsplash.com/photo-1587202372775-9891c82f4d7e",
    category: VALID_CATEGORY,
    description: "Gaming laptop"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products Inserted");

    process.exit();
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
};

seedData();
