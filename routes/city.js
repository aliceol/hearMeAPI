const express = require("express");
const app = express();
var router = express.Router();
// var isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();
const axios = require("axios");

// ROUTE HOME AVEC METRO AREA PREDEFINIE. IL FAUDRA LA FAIRE VENIR
// DES INFOS DU USER POUR LUI DONNER LES EVENTS PROCHE DE CHEZ LUI
// CETTE ROUTE CORRESPOND AUX UPCOMING EVENTS

// WE DECLARE THE TODAY DATE

const moment = require("moment");
let today = moment().format("YYYY-MM-DD");

var inOneYear = moment()
  .add(1, "year")
  .format("YYYY-MM-DD");
console.log(inOneYear);

router.get("/upcoming/:id/:page", function(req, res) {
  // THE METRO AREA LOOK LIKE A NUMBER
  // FOR EXEMPLE PARIS IN FRANCE IS 28909
  axios
    .get(
      "https://api.songkick.com/api/3.0/metro_areas/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET +
        "&min_date=" +
        today +
        "&max_date=" +
        inOneYear +
        "&page=" +
        req.params.page
    )
    .then(function(response) {
      let myEvents = [];
      for (let i = 0; i < response.data.resultsPage.results.event.length; i++) {
        if (
          response.data.resultsPage.results.event[i].venue.displayName !==
          "Unknown venue"
        ) {
          myEvents.push(response.data.resultsPage.results.event[i]);
        }
      }
      res.json({ response: myEvents });
    })
    .catch(function(error) {
      res.status(404).json("Page introuvable");
    });
});

router.get("/popular/:id/:page", function(req, res) {
  // THE METRO AREA LOOK LIKE A NUMBER
  // FOR EXEMPLE PARIS IN FRANCE IS 28909
  axios
    .get(
      "https://api.songkick.com/api/3.0/metro_areas/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET +
        "&min_date=" +
        today +
        "&max_date=" +
        inOneYear +
        "&page=" +
        req.params.page
    )
    .then(function(response) {
      const sort_by = function(field, reverse, primer) {
        // THIS IS A FUNCTION TO SORT THE RESULTS BY A CERTAIN FIELD (NUMBER)
        var key = primer
          ? function(x) {
              return primer(x[field]);
            }
          : function(x) {
              return x[field];
            };

        reverse = !reverse ? 1 : -1;

        return function(a, b) {
          return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
        };
      };

      let myData = [];

      for (let i = 0; i < response.data.resultsPage.results.event.length; i++) {
        myData.push(response.data.resultsPage.results.event[i]);
      }

      myData.sort(sort_by("popularity", true, parseFloat));
      // SORT BY POPULARITY

      res.json(myData);

      console.log(myData);
    })

    .catch(function(error) {
      res.status(404).json("Page introuvable");
    });
});

// router.get("/popular/:id/:page", function(req, res) {
//   // THE METRO AREA LOOK LIKE A NUMBER
//   // FOR EXEMPLE PARIS IN FRANCE IS 28909
//   axios
//     .get(
//       "https://api.songkick.com/api/3.0/metro_areas/" +
//         req.params.id +
//         "/calendar.json?apikey=" +
//         process.env.SONGKICK_API_SECRET +
//         "&min_date=" +
//         today +
//         "&max_date=" +
//         inOneYear +
//         "&page=" +
//         req.params.page
//     )
//     .then(function(response) {
//       const sort_by = function(field, reverse, primer) {
//         var key = primer
//           ? function(x) {
//               return primer(x[field]);
//             }
//           : function(x) {
//               return x[field];
//             };

//         reverse = !reverse ? 1 : -1;

//         return function(a, b) {
//           return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
//         };
//       };

//       axios
//         .get(
//           "https://api.songkick.com/api/3.0/metro_areas/" +
//             req.params.id +
//             "/calendar.json?apikey=" +
//             process.env.SONGKICK_API_SECRET +
//             "&min_date=" +
//             today +
//             "&max_date=" +
//             inOneYear +
//             "&page=" +
//             2
//         )
//         .then(function(response) {
//           let myResponses = [];

//           for (
//             let i = 0;
//             i < response.data.resultsPage.results.event.length;
//             i++
//           ) {
//             myResponses = response.data.resultsPage.results.event[i];
//           }
//           return myResponses;
//         })
//         .catch(function(error) {
//           res.status(404).json("Page introuvable");
//         });

//       let myData = myResponses;

//       for (let i = 0; i < response.data.resultsPage.results.event.length; i++) {
//         myData.push(response.data.resultsPage.results.event[i]);
//       }

//       myData.sort(sort_by("popularity", true, parseFloat));

//       res.json(myData);

//       console.log(myData);
//     })

//     .catch(function(error) {
//       res.status(404).json("Page introuvable");
//     });
// });

module.exports = router;
