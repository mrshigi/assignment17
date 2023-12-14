const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoDB = require("mongodb");
const mongoose = require("mongoose");
const path = require("path");

// Update the path to the Book model located in the public folder
const Book = require("./bookModel");

app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://sraudat:seaner@data.fx1dsw5.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Joi schema for validation
const validateBook = (book) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    rating: Joi.number().min(1).max(5).optional(),
    summaries: Joi.array().items(Joi.string()).optional(),
    img: Joi.string().optional(),
  });

  return schema.validate(book);
};

// GET endpoint to serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// GET endpoint to retrieve all books
app.get("/api/books", async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

// POST endpoint to add a new book
app.post("/api/books", upload.single("img"), async (req, res) => {
  try {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let book = new Book({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      summaries: req.body.summaries.split(","),
      img: req.file ? req.file.path : "",
    });

    book = await book.save();
    res.send(book);
  } catch (err) {
    console.error("Error in POST /api/books:", err.message);
    res.status(500).send("Server error");
  }
});
// PUT endpoint to update a book
app.put("/api/books/:id", upload.single("img"), async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      rating: req.body.rating,
      summaries: req.body.summaries.split(","),
      img: req.file ? req.file.path : req.body.img,
    },
    { new: true }
  );

  if (!book) return res.status(404).send("Book not found");
  res.send(book);
});

// DELETE endpoint to delete a book
app.delete("/api/books/:id", async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);
  if (!book) return res.status(404).send("Book not found");
  res.send("Book deleted");
});

app.listen(3000, () => {
  console.log("666 satan mf");
});
