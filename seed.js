const mongoose = require('mongoose');
const Book = require('./public/bookModel');

// Replace with your MongoDB connection string
mongoose
  .connect("mongodb+srv://sraudat:seaner@data.fx1dsw5.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const books = [
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
async function seedBooks() {

    for (const bookData of books) {
        const book = new Book(bookData);
        await book.save();
    }

    console.log('Books have been seeded!');
    db.close();
}

seedBooks();