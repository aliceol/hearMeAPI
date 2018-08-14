const express = require("express");
const app = express();
var router = express.Router();
// var isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();
const axios = require("axios");

// WE DECLARE THE TODAY DATE

const moment = require("moment");
let today = moment().format("YYYY-MM-DD");

var inOneYear = moment()
  .add(1, "year")
  .format("YYYY-MM-DD");

// THIS ROUTE GIVE US THE CALENDAR OF AN ARTIST

router.get("/:id/:page", function(req, res) {
  // THE ID LOOK LIKE THIS 68043-gorillaz
  axios
    .get(
      "https://api.songkick.com/api/3.0/artists/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET +
        "&min_date=" +
        today +
        "&max_date=" +
        inOneYear +
        "&page=" +
        req.params.page +
        "&per_page=20"
    )
    .then(function(response) {
      axios.get("");

      res.json({ response: response.data });
    })
    .catch(function(error) {
      res.json({ response: error });
    });
});

module.exports = router;

// EXEMPLE OF A REPONSE OF AN ARTIST CALENDAR WITH ONLY ONE EVENT

// {
//   "resultsPage": {
//     "results": {
//       "event": [
//         {
//           "id":11129128,
//           "type":"Concert",
//           "uri":"http://www.songkick.com/concerts/11129128-wild-flag-at-fillmore?utm_source=PARTNER_ID&utm_medium=partner",
//           "displayName":"Wild Flag at The Fillmore (April 18, 2012)",
//           "start": {
//             "time":"20:00:00",
//             "date":"2012-04-18",
//             "datetime":"2012-04-18T20:00:00-0800"
//           },
//           "performance": [
//             {
//               "artist": {
//                 "id":29835,
//                 "uri":"http://www.songkick.com/artists/29835-wild-flag?utm_source=PARTNER_ID&utm_medium=partner",
//                 "displayName":"Wild Flag",
//                 "identifier": []
//               },
//               "id":21579303,
//               "displayName":"Wild Flag",
//               "billingIndex":1,
//               "billing":"headline"
//             }
//           ],
//           "location": {
//             "city":"San Francisco, CA, US",
//             "lng":-122.4332937,
//             "lat":37.7842398
//           },
//           "venue": {
//             "id":6239,
//             "displayName":"The Fillmore",
//             "uri":"http://www.songkick.com/venues/6239-fillmore?utm_source=PARTNER_ID&utm_medium=partner",
//             "lng":-122.4332937,
//             "lat":37.7842398,
//             "metroArea": {
//               "id":26330,
//               "uri":"http://www.songkick.com/metro_areas/26330-us-sf-bay-area?utm_source=PARTNER_ID&utm_medium=partner",
//               "displayName":"SF Bay Area",
//               "country": { "displayName":"US" },
//               "state": { "displayName":"CA" }
//             }
//           },
//           "status":"ok",
//           "popularity":0.012763
//         }, ....
//       ]
//     },
//     "totalEntries":24,
//     "perPage":50,
//     "page":1,
//     "status":"ok"
//   }
// }
