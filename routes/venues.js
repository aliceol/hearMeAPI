const express = require("express");
const app = express();
var router = express.Router();
// var isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();
const axios = require("axios");

var Venues = require("../models/Venue.js");

// ROAD TO FIND A VENUE CALENDAR

router.get("/:id", function(req, res) {
  // EXEMPLE OF A VENUE ID :
  // LA CLAIRIERE 3294744-la-clairiere

  axios
    .get(
      "https://api.songkick.com/api/3.0/search/venues.json?query=concrete&apikey=" +
        process.env.SONGKICK_API_SECRET
    )
    .then(function(response) {
      res.json({ response: response.data });
    })
    .catch(function(error) {
      res.json({ response: error });
    });
});

module.exports = router;
