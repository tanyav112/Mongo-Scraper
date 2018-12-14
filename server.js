const PORT = process.env.PORT || 3030;
const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const db = require("./models");

//Remote mongo setup

// Connect to the Mongo DB
mongoose.connect(
  "mongodb://localhost/mongoScraper",
  { useNewUrlParser: true }
);

// Make public a static folder
app.use(express.static(require("path").join(__dirname, "public")));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/apiRoutes")(app);

//Home page route
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// A GET route for scraping the NYT website
var scraped = require("./models/data.js");
app.get("/scrape", function(req, res) {
  // var result = [];
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/section/world").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    // Save an empty result object
    var result = {};

    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.headline").each(function(i, element) {
      let length = 0;
      if (i > length) {
        return false;
      }
  // Add the text and href of every link, and save them as properties of the result object
    result.title = $(element).text().trim();
    result.summary = $(element).siblings("p").text().trim();
    result.link = $(element).children("a").attr("href");
    
  // Create a new Article using the `result` object built from scraping
  console.log(JSON.stringify(result))
  db.Article.create(result)
        .then(function(dbArticle) {
          console.log("Inside then...");
          console.log(dbArticle);
          scraped.push(result);
          res.send("result");
        })
        .catch(function(e) {
          console.log("Inside catch...");
          console.log(e);
        });
    }); 
  }); 
}); 

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.listen(process.env.PORT || 3030, () => console.log("http://localhost:3030"));
