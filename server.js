const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoDB = require("mongodb");
const mongoose = require("mongoose");
const path = require("path");

app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

// MongoDB connection

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sraudat:seaner@data.hkvq2dq.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
/*mongoose
  .connect(
    "mongodb+srv://sraudat:seaner@data.hkvq2dq.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));*/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
const upload = multer({ dest: __dirname + "/public/images" });


const bookschema = new mongoose.Schema({
  name: String,
  description: String,
  summaries: [String],
  img: String, // For storing image path
});

const Book = mongoose.model("Book", bookschema);

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
    book.img = "images/" + req.file.filename;
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
    fieldsToUpdate.img = "images/" + req.file.filename;
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
