const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const fixStock = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.updateMany(
      {},
      {
        $set: { stock: 20 } // ✅ THIS is the correct field
      }
    );

    console.log("✅ Stock updated successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixStock();
