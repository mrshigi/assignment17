const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://sraudat:seaner@data.yrbfwa1.mongodb.net/books?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));
// Multer configuration for image upload
const upload = multer({ dest: __dirname + "/public/uploads" });

const bookschema = new mongoose.Schema({
  name: String,
  description: String,
  summaries: [String],
  img: String,
});

const Book = mongoose.model("Book", bookschema);
const validateBook = (book) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    summaries: Joi.string().required(),
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

app.post("/api/books", upload.single("img"), (req, res) => {
  const result = validateBook(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const book = new Book({
    name: req.body.name,
    description: req.body.description,
    summaries: req.body.summaries.split(","),
  });

if (req.file) {
  book.img = "uploads/" + req.file.filename;
}
  createBook(book, res);
});

const createBook = async (book, res) => {
  const result = await book.save();
  res.send(book);
};

app.put("/api/books/:id", upload.single("img"), (req, res) => {
  const result = validateBook(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  updateBook(req, res);
});

const updateBook = async (req, res) => {
  let fieldsToUpdate = {
    name: req.body.name,
    description: req.body.description,
    summaries: req.body.summaries.split(","),
  };

  if (req.file) {
    fieldsToUpdate.img = "uploads/" + req.file.filename;
  }

  const result = await Book.updateOne({ _id: req.params.id }, fieldsToUpdate);
  const Book = await Book.findById(req.params.id);
  res.send(Book);
};

app.delete("/api/books/:id", upload.single("img"), (req, res) => {
  removeBook(res, req.params.id);
});

const removeBook = async (res, id) => {
  const book = await Book.findByIdAndDelete(id);
  res.send(book);
};

app.listen(3010, () => {
  console.log("666 satan mf");
});
