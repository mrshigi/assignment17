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
mongoose
  .connect(
    "mongodb+srv://sraudat:seaner@data.hkvq2dq.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

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
const books = [
  {
    _id: 1,
    name: "The Road",
    description: "Apocolyptic",
    summaries: [
      "Basic Overview: A man and his son's journey",
      "Nuclear winter event happened",
      "Man's wife kills herself",
      "Man left alone with child",
      "They fight to survive daily",
      "Run from human eating folk",
      "Man is sick",
      "Man brings child to coast",
      "Man get shot in the leg by arrow",
      "Man dies",
      "Family finds child, saves him",
      "The end, super depressing read",
    ],
    img: "images/road.png",
  },
  {
    _id: 2,
    name: "Neon Genesis: Evangelion",
    description: "Mecha Manga",
    summaries: [
      "Basic Overview: Shinji Ikaris journey to self acceptance, via ending the world",
      "Get in the Eva Shinji",
      "Angels from 'god' sent to earth",
      "Shinji beats up some angels",
      "Sinister plan in the background",
      "2 other girls pilot the evas",
      "Shinji get in the F*ing eva",
      "World Govt steps in to stop sinister plan",
      "Stuff hits the fan and Shinji kinda brings end of world",
      "Shinji accepts himself, stops total world destruction but resets world population",
    ],
    img: "images/eva.png",
  },
  {
    _id: 3,
    name: "Options Pricing and Volatility",
    description: "Finance",
    summaries: [
      "Basic Overview: The stock market wasnt enough of a way to lose money",
      "Introduce Forwards",
      "Introduce Future contracts",
      "Introduce options",
      "Introduce the Greeks, these are first and secord order Derivs of Stock Price, Volatility and Time",
      "Math brainf*ck: no joke Stochastic Processes and partial derivatives on each Greek",
      "Basic Options strategies: Straddle, Strangle, Covered Call, Protected Put",
      "Wizard Options strategies: Calendar Spreads, Iron Condor, Christmas Trees, literally sounds fake",
      "COMBINE THEM ALL INTO COMPLEX FINACIAL INSTRUMENTS",
      "BLOW UP WORLD ECONOMY VIA DEBT DERIVATIVES",
    ],
    img: "images/options.png",
  },
];


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
async function seedBooks() {
  for (const bookData of books) {
    const book = new Book(bookData);
    await book.save();
  }

  console.log("Books have been seeded!");
  db.close();
}

seedBooks();

const validateBook = (book) => {
  const schema = Joi.object({
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
