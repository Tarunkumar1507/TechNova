const mongoose = require('mongoose');
const seedProducts = require('../services/seeder');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/technova',
      {
        serverSelectionTimeoutMS: 5000, // Fail fast if DB unreachable (5s)
        connectTimeoutMS: 5000,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Seed default electronics products if empty
    await seedProducts();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Running in fallback (in-memory) mode — DB unavailable.');
    // Do NOT exit process on Vercel; productController will use in-memory data
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
