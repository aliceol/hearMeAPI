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
console.log(inOneYear);

// ROAD TO FIND A VENUE CALENDAR

router.get("/calendar/:id", function(req, res) {
  // EXEMPLE OF A VENUE ID :
  // LA CLAIRIERE 3294744-la-clairiere

  axios
    .get(
      "https://api.songkick.com/api/3.0/venues/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET +
        "&min_date=" +
        today +
        "&max_date=" +
        inOneYear
    )
    .then(function(response) {
      res.json(response.data);
    })
    .catch(function(error) {
      res.json(error);
    });
});

module.exports = router;
