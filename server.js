const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());


mongoose
  .connect("mongodb+srv://sraudat:seaner@cluster0.oh5cmuh.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

  const bookSchema = new mongoose.Schema({
    name: String,
    description: String,
    rating: Number,
    summaries: [String],
    img: String // Store the image path
  });

  const Book = mongoose.model('Book', bookSchema);

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let books = [
  {
    _id: 1,
    name: "The Road",
    description: "Apocolyptic",
    rating: 4,
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
    rating: 5,
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
    rating: 5,
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

app.get("/api/books", (req, res) => {
  res.send(books);
});
app.post('/api/books', upload.single('img'), async (req, res) => {
  // Validate data with Joi
  const { error } = bookValidationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create a new book instance
  const book = new Book({
    name: req.body.name,
    description: req.body.description,
    rating: req.body.rating,
    summaries: req.body.summaries.split(','),
    img: req.file.path
  });

  try {
    await book.save();
    res.send(book);
  } catch (err) {
    res.status(500).send('Error saving book');
  }
});
app.put('/api/books/:id', upload.single('img'), async (req, res) => {
  // Validate data with Joi
  const { error } = bookValidationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const book = await Book.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      rating: req.body.rating,
      summaries: req.body.summaries.split(','),
      img: req.file ? req.file.path : req.body.img
    }, { new: true });

    if (!book) return res.status(404).send('Book not found');
    res.send(book);
  } catch (err) {
    res.status(500).send('Error updating book');
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.send(book);
  } catch (err) {
    res.status(500).send('Error deleting book');
  }
});
const validateBook = (book) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    summaries: Joi.allow(""),
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    img: Joi.string().allow("")
  });

  return schema.validate(book);
};

app.listen(3000, () => {
  console.log("666 satan mf");
});
