const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required. Add it to your .env file.');
  mongoose.set('strictQuery', true);
  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
}

module.exports = connectDB;
