const express = require("express");
const app = express();
var router = express.Router();
// var isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();
const axios = require("axios");

var Venues = require("../models/Venue.js");

// WE DECLARE THE TODAY DATE

const moment = require("moment");
let today = moment().format("YYYY-MM-DD");

var inOneYear = moment()
  .add(1, "year")
  .format("YYYY-MM-DD");

// ROAD TO FIND A VENUE CALENDAR

router.get("/:id", function(req, res) {
  // EXEMPLE OF A VENUE ID :
  // LA CLAIRIERE 3294744-la-clairiere

  axios
    .get(
      /* "https://api.songkick.com/api/3.0/venues/" +
        req.params.id +
        ".json?apikey=" +
        process.env.SONGKICK_API_SECRET */
      "https://api.songkick.com/api/3.0/venues/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET
    )
    .then(function(response) {
      let finalResponse = { ...response.data };
      axios
        .get(
          "https://api.songkick.com/api/3.0/venues/" +
            req.params.id +
            ".json?apikey=" +
            process.env.SONGKICK_API_SECRET
        )
        .then(function(response2) {
          finalResponse.resultsPage.results.venueDetails =
            response2.data.resultsPage.results.venue;
          res.json({ response: finalResponse.resultsPage.results });
        })
        .catch(function(error) {
          res.json({ response: error });
        });
    })
    .catch(function(error) {
      res.json({ response: error });
    });
});

module.exports = router;
