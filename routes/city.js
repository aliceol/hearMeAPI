const express = require("express");
const app = express();
var router = express.Router();
// var isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();
const axios = require("axios");
var getArtistImage = require("../components/getArtistImage.js");

// ROUTE HOME AVEC METRO AREA PREDEFINIE. IL FAUDRA LA FAIRE VENIR
// DES INFOS DU USER POUR LUI DONNER LES EVENTS PROCHE DE CHEZ LUI
// CETTE ROUTE CORRESPOND AUX UPCOMING EVENTS

// WE DECLARE THE TODAY DATE

const moment = require("moment");
let today = moment().format("YYYY-MM-DD");

var inOneYear = moment()
  .add(1, "year")
  .format("YYYY-MM-DD");

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
        "&per_page=" +
        20 +
        "&page=" +
        req.params.page
    )
    .then(function(response) {
      let event = [];
      let upcomingEventsPicturesPromises = [];
      let numberOfEvents = response.data.resultsPage.results.event.length;
      for (let i = 0; i < response.data.resultsPage.results.event.length; i++) {
        let oneEvent = response.data.resultsPage.results.event[i];
        upcomingEventsPicturesPromises.push(
          getArtistImage(oneEvent.performance[0].artist.uri)
        );
      }

      Promise.all(upcomingEventsPicturesPromises).then(URIObjects => {
        for (let i = 0; i < URIObjects.length; i++) {
          let oneEvent = response.data.resultsPage.results.event[i];
          console.log("before", oneEvent.performance[0].artist);
          console.log(URIObjects[i]);
          oneEvent.performance[0].artist.pictureURI = URIObjects[i][0]
            ? URIObjects[i][0].src
            : null;
          console.log("after", oneEvent.performance[0].artist);
          if (
            response.data.resultsPage.results.event[i].venue.displayName !==
            "Unknown venue"
          ) {
            event.push(oneEvent);
          } else {
            numberOfEvents -= 1;
          }
          if (event.length === numberOfEvents) {
            res.json(event);
          }
        }
      });
      /* new Promise((resolve, reject) => {
          let oneEvent = response.data.resultsPage.results.event[i];

          getArtistImage(oneEvent.performance[0].artist.uri).then(URI => {
            oneEvent.performance[0].artist.pictureURI = URI[0]
              ? URI[0].src
              : null;
            console.log(
              response.data.resultsPage.results.event[i].venue.displayName
            );
            if (
              response.data.resultsPage.results.event[i].venue.displayName !==
              "Unknown venue"
            ) {
              event.push(oneEvent);
            } else {
              numberOfEvents -= 1;
            }
            console.log(i, event.length, numberOfEvents);
            if (event.length === numberOfEvents) {
              console.log("event", event);
              res.json(event);
            }
          });
        });
       */
    })

    .catch(function(error) {
      console.log(error);
      res.status(404).json("Page introuvable");
    });
});

router.get("/popular/:id/:page", function(req, res) {
  // THE METRO AREA LOOK LIKE A NUMBER
  // FOR EXEMPLE PARIS IN FRANCE IS 28909

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

  let gettingEventsPromises = [];

  for (let i = 1; i <= 5; i++) {
    gettingEventsPromises.push(
      axios.get(
        "https://api.songkick.com/api/3.0/metro_areas/" +
          req.params.id +
          "/calendar.json?apikey=" +
          process.env.SONGKICK_API_SECRET +
          "&min_date=" +
          today +
          "&max_date=" +
          inOneYear +
          "&page=" +
          i
      )
    );
  }

  /* Promise.all(gettingEventsPromises).then(values => {
    let eventsByPop = [];
    let gettingArtistsPicsPromises = [];
    for (let i = 0; i < values.length; i++) {
      for (let j = (req.params.page - 1) * 10; j < req.params.page * 10; j++) {
        gettingArtistsPicsPromises.push(
          getArtistImage(
            values[i].data.resultsPage.results.event[j].performance[0].artist
              .uri
          )
        );
        eventsByPop.push(values[i].data.resultsPage.results.event[j]);
      }
    }
    Promise.all(gettingArtistsPicsPromises).then(URIObjects => {
      for (let i = 0; i < URIObjects.length; i++) {
        eventsByPop[i].performance[0].artist.pictureURI = URIObjects[i][0]
          ? URIObjects[i][0].src
          : null;
      }

      eventsByPop.sort(sort_by("popularity", true, parseFloat));
      let eventsWithLocation = [];
      for (let i = 0; i < eventsByPop.length; i++) {
        if (eventsByPop[i].venue.displayName !== "Unknown venue") {
          console.log(eventsByPop.length, eventsByPop[i].id);
          eventsWithLocation.push(eventsByPop[i]);
        }
      }

      res.json(eventsWithLocation);
    });
  }); */

  let RESULTS_PER_PAGE = 20;

  Promise.all(gettingEventsPromises).then(values => {
    let allEvents = [];
    let gettingArtistsPicsPromises = [];
    for (let i = 0; i < values.length; i++) {
      for (
        let j = 0;
        j < values[i].data.resultsPage.results.event.length;
        j++
      ) {
        allEvents.push(values[i].data.resultsPage.results.event[j]);
      }
    }
    let eventsByPop = allEvents.sort(sort_by("popularity", true, parseFloat));

    for (
      let j = (req.params.page - 1) * RESULTS_PER_PAGE;
      j < req.params.page * RESULTS_PER_PAGE;
      j++
    ) {
      gettingArtistsPicsPromises.push(
        getArtistImage(eventsByPop[j].performance[0].artist.uri)
      );
    }
    Promise.all(gettingArtistsPicsPromises).then(URIObjects => {
      for (let i = 0; i < URIObjects.length; i++) {
        eventsByPop[
          i + (req.params.page - 1) * RESULTS_PER_PAGE
        ].performance[0].artist.pictureURI = URIObjects[i][0]
          ? URIObjects[i][0].src
          : null;
      }
      res.json(
        eventsByPop.slice(
          (req.params.page - 1) * RESULTS_PER_PAGE,
          req.params.page * RESULTS_PER_PAGE
        )
      );
    });

    /*   for (let j = (req.params.page - 1) * 10; j < req.params.page * 10; j++) {
      gettingArtistsPicsPromises.push(
        getArtistImage(
          values[i].data.resultsPage.results.event[j].performance[0].artist.uri
        )
      );
      eventsByPop.push(values[i].data.resultsPage.results.event[j]);
    }
    Promise.all(gettingArtistsPicsPromises).then(URIObjects => {
      for (let i = 0; i < URIObjects.length; i++) {
        eventsByPop[i].performance[0].artist.pictureURI = URIObjects[i][0]
          ? URIObjects[i][0].src
          : null;
      }

      eventsByPop.sort(sort_by("popularity", true, parseFloat));
      let eventsWithLocation = [];
      for (let i = 0; i < eventsByPop.length; i++) {
        if (eventsByPop[i].venue.displayName !== "Unknown venue") {
          console.log(eventsByPop.length, eventsByPop[i].id);
          eventsWithLocation.push(eventsByPop[i]);
        }
      }

      res.json(eventsWithLocation);
    }); */
  });
});

/*   let myData = [];
  let i = 1;
  const getData = function(i) {
    if (i <= 5) {
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
            i
        )
        .then(function(response) {
          let event = [];
          for (
            let i = 0;
            i < response.data.resultsPage.results.event.length;
            i++
          ) {
            if (
              response.data.resultsPage.results.event[i].venue.displayName !==
              "Unknown venue"
            ) {
              event.push(response.data.resultsPage.results.event[i]);
            }
          }

          for (let j = 0; j < event.length; j++) {
            myData.push({ popularity: event[j].popularity, index: j });
            if (j === event.length - 1) {
              getData(i + 1);
            }
          }
        })
        .then(() => {
          myData.sort(sort_by("popularity", true, parseFloat));
          // SORT BY POPULARITY
        })
        .catch(function(error) {
          res.status(404).json("Page introuvable");
        });
    } else {
      //res.json(myData);
    }
  };

  getData(1); */

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
