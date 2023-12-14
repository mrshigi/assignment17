const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // Serve static files

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://sraudat:seaner@data.yrbfwa1.mongodb.net/books?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ),
});
const upload = multer({ storage });

// Book Schema and Model
const bookSchema = new mongoose.Schema({
  name: String,
  description: String,
  summaries: [String],
  img: String,
});
const Book = mongoose.model("Book", bookSchema);

// Joi Validation Schema
const validateBook = (book) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    summaries: Joi.string().required(), // Assuming summaries are a string of comma-separated values
    img: Joi.string().optional(),
  });
  return schema.validate(book);
};
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/books", (req, res) => {
  getBooks(res);
});

const getBooks = async (res) => {
  const books = await Book.find();
  res.send(books);
};

// POST - Create a new book
app.post("/api/books", upload.single("img"), async (req, res) => {
  // Joi Validation
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create new book
  let book = new Book({
    name: req.body.name,
    description: req.body.description,
    summaries: req.body.summaries.split(","),
    img: req.file ? req.file.filename : null,
  });

  try {
    book = await book.save();
    res.send(book);
  } catch (err) {
    res.status(500).send("Error saving the book: " + err.message);
  }
});

// PUT - Update a book
app.put("/api/books/:id", upload.single("img"), async (req, res) => {
  // Joi Validation
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const update = {
    name: req.body.name,
    description: req.body.description,
    summaries: req.body.summaries.split(","),
    img: req.file ? req.file.filename : req.body.img,
  };

  try {
    const book = await Book.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!book)
      return res.status(404).send("The book with the given ID was not found.");
    res.send(book);
  } catch (err) {
    res.status(500).send("Error updating the book: " + err.message);
  }
});

// DELETE - Delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book)
      return res.status(404).send("The book with the given ID was not found.");
    res.send(book);
  } catch (err) {
    res.status(500).send("Error deleting the book: " + err.message);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
