const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config()
const mongooseURI = process.env.MONGOURI
mongoose.set('strictQuery', true)
async function connectToDatabase() {
  try {
    await mongoose.connect(mongooseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB database!');
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
  }
}
connectToDatabase()
module.exports = connectToDatabase;
