const mongoose = require('mongoose');

// Mongoose schema for books
const bookSchema = new mongoose.Schema({
    name: String,
    description: String,
    rating: Number,
    summaries: [String],
    img: String, // For storing image path
});

// Create and export the model
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;