const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
const upload = multer({ dest: __dirname + "/public/images" });
// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://sraudat:seaner@data.hkvq2dq.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const bookschema = new mongoose.Schema({
  name: String,
  description: String,
  summaries: [String],
  img: String, // For storing image path
});

const Book = mongoose.model("Book", bookschema);

app.get("https://a17-dxv5.onrender.com/api/books", (req, res) => {
  getBooks(res);
});

const getBooks = async (res) => {
  const books = await Book.find();
  res.send(books);
};

app.post("https://a17-dxv5.onrender.com/api/books", upload.single("img"), (req, res) => {
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
    book.img = "images/" + req.file.filename;
  }

  createBook(book, res);
});

const createBook = async (book, res) => {
  const result = await book.save();
  res.send(book);
};

app.put("https://a17-dxv5.onrender.com/api/books/:id", upload.single("img"), (req, res) => {
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
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const result = await Book.updateOne({ _id: req.params.id }, fieldsToUpdate);
  const Book = await Book.findById(req.params.id);
  res.send(Book);
};

app.delete("https://a17-dxv5.onrender.com/api/books/:id", upload.single("img"), (req, res) => {
  removeBook(res, req.params.id);
});

const removeBook = async (res, id) => {
  const book = await Book.findByIdAndDelete(id);
  res.send(book);
};

const validateBook = (book) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    summaries: Joi.array().items(Joi.string()).optional(),
    img: Joi.string().optional(),
  });

  return schema.validate(book);
};

app.listen(3010, () => {
  console.log("666 satan mf");
});
