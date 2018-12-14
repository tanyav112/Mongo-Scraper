var scraped = require("../models/data.js");

module.exports = function(app) {
  app.get("/api/scraped", function(req, res){
    res.json(scraped);
  });
 app.post("/api/scraped", function(req, res) {
   "use strict";
   var scapedInfo = req.body;
   console.log(scrapedInfo);
   scraped.push(scrapedInfo);
 });
};