const mongoose = require('mongoose');
const seedProducts = require('../services/seeder');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/technova');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Seed default electronics products if empty
    await seedProducts();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
