const express = require("express");
const app = express();
var router = express.Router();
// var isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();
const axios = require("axios");

/* FUNCTIONS */
const { doesEventExists } = require("../lib/songKick");

//TO SAVE THE DATA I NEED TO IMPORT THE DIFFERENT SCHEMAS

var Event = require("../models/Event.js");
var Artist = require("../models/Artist.js");
var Venue = require("../models/Venue.js");

// THIS ROAD GIVE US ALL THE INFOS ABOUT AN EVENT.
// WE NEED THE EVENT ID TO GET ALL OF THIS

router.get("/:id", function(req, res) {
  // WE ARE LOOKING IN OUR DATABASE IF WE CAN FIND AN EVENT WITH THE SAME ID
  Event.findOne({ songKickId: req.params.id })
    .populate("venue")
    .exec(function(err, obj) {
      if (err) {
        // IF THIS ID ISN'T RELATED TO AN EVENT
        res.status(400).json({ error: "An error occured" });
      } else {
        console.log("obj", obj);
        if (obj === null) {
          // IF THE EVENT THAT WE ARE LOOKING FOR IS NOT IN OUR DATA BASE
          axios
            .get(
              "https://api.songkick.com/api/3.0/events/" +
                req.params.id +
                ".json?apikey=" +
                process.env.SONGKICK_API_SECRET
            )
            // WE ARE CALLING THE SONGKICK API TO GET ALL THE INFO THAT WE NEED
            // THE EVENT CONTAINS INFO ABOUT ITSELF, ABOUT THE ARTISTS PLAYING DURING THE EVENT
            // AND ABOUT THE VENUE (CLUB)
            .then(function(response) {
              Venue.findOne({
                // FIRST WE ARE LOOKING IN OUR DATABASE IF WE HAVE THE INFOS ABOUT THE VENUE
                songKickId: response.data.resultsPage.results.event.venue.id
              }).exec(err, obj => {
                if (err) {
                  console.log(err);
                } else {
                  const arrayArtists = [];
                  if (obj) {
                    console.log(
                      "il y a une venue",
                      response.data.resultsPage.results
                    );
                    // IF THE VENUE ALREADY EXISTS IN THE DATA BASE, WE NEED TO KNOW IF THE ARTISTS PLAYING
                    // THERE ARE IN THE DB

                    const artists = [];

                    for (
                      let i = 0;
                      i <
                      response.data.resultsPage.results.event.performance
                        .length;
                      i++
                    ) {
                      artists.push({
                        artist:
                          response.data.resultsPage.results.event.performance[i]
                            .artist,
                        position:
                          response.data.resultsPage.results.event.performance[i]
                            .billingIndex
                      });
                    }
                    console.log("artists", artists);

                    for (let i = 0; i < artists.length; i++) {
                      Artist.findOne({
                        songKickId: artists[i].artist.id
                      }).exec(err, artist => {
                        if (err) {
                          // IF THE ARTIST ID DOES NOT EXISTS
                          console.log(err);
                        } else {
                          if (artist) {
                            console.log("artist already exists");
                            // IF THE ARTIST IS ALREADY KNOW BY OUR DB, WE JUST PUSH THESE INFOS FROM OUR DB TO AN ARRAY
                            arrayArtists.push({
                              artist: artists.artist,
                              position: artists[i].position
                            });
                          } else {
                            console.log("artist DOES NOT exist");
                            // THE ARTIST IS UNKNOW SO WE CREATE A NEW ONE IN OUR DB
                            const newArtist = new Artist({
                              uri: artists[i].artist.uri,
                              displayName: artists[i].artist.displayName,
                              songKickId: artists[i].artist.id,
                              identifier: artists[i].artist.identifier.href // A LINK TO HIS SONGKICK PROFIL
                            });
                            newArtist.save((err, artist) => {
                              if (err) {
                                console.log(err);
                              } else {
                                // WE SAVE IT THEN WE PUSH THE INFOS THAT WE NEED IN AN ARRAY THAT WILL BE RETURN TO OUR USERS
                                arrayArtists.push({
                                  artist: artist._id,
                                  position: artists[i].position
                                });
                                if (i === artists.length - 1) {
                                  let thisEvent =
                                    response.data.resultsPage.resultsPage
                                      .results.event;

                                  console.log("arrayArtists", arrayArtists);
                                  const event = new Event({
                                    songKickId: thisEvent.id,
                                    venue: obj,
                                    popularity: thisEvent.popularity,
                                    uri: thisEvent.uri,
                                    title: thisEvent.displayName,
                                    performance: arrayArtists,
                                    start: thisEvent.start,
                                    ageMin: thisEvent.ageRestriction,
                                    eventType: thisEvent.type
                                  });

                                  console.log(event.start);
                                  event.save(function(err) {
                                    if (err) {
                                      return res.json(err.message);
                                    } else {
                                      return res.json({
                                        response: response.data
                                      });
                                    }
                                  });
                                }
                              }
                            });
                          }
                        }
                      });
                    }
                  } else {
                    console.log("il n'y a pas de venue");
                    // IF THE VENUE IS NOT IN THE DB
                    const venue = response.data.resultsPage.results.event.venue;
                    const newVenue = new Venue({
                      // WE DECLARE ALL THE INFOS THAT WE NEED
                      songKickId: venue.id,
                      name: venue.displayName,
                      uri: venue.uri,
                      address: venue.street,
                      city: venue.city.displayName,
                      country: venue.city.country.displayName,
                      zip: venue.zip,
                      lat: venue.lat,
                      lng: venue.lng,
                      description: venue.description,
                      website: venue.website
                    });
                    newVenue.save((err, venue) => {
                      // THEN WE SAVE IT IN OUR DB
                      if (err) {
                        console.log(err);
                      } else {
                        // AGAIN WE WANT TO KNOW IF WE KNOW ALL THE ARTISTS PLAYING DURING THIS EVENT
                        const artists = [];

                        for (
                          let i = 0;
                          i <
                          response.data.resultsPage.results.event.performance
                            .length;
                          i++
                        ) {
                          artists.push({
                            artist:
                              response.data.resultsPage.results.event
                                .performance[i].artist,
                            position:
                              response.data.resultsPage.results.event
                                .performance[i].billingIndex
                          });
                        }
                        console.log("artists", artists);

                        for (let i = 0; i < artists.length; i++) {
                          Artist.findOne({
                            songKickId: artists[i].artist.id
                          }).exec(err, artist => {
                            if (err) {
                              // IF THE ARTIST ID DOES NOT EXISTS
                              console.log(err);
                            } else {
                              if (artist) {
                                console.log("artist already exists");
                                // IF THE ARTIST IS ALREADY KNOW BY OUR DB, WE JUST PUSH THESE INFOS FROM OUR DB TO AN ARRAY
                                arrayArtists.push({
                                  artist: artists.artist,
                                  position: artists[i].position
                                });
                              } else {
                                console.log("artist DOES NOT exist");
                                // THE ARTIST IS UNKNOW SO WE CREATE A NEW ONE IN OUR DB

                                const newArtist = new Artist({
                                  uri: artists[i].artist.uri,
                                  displayName: artists[i].artist.displayName,
                                  songKickId: artists[i].artist.id,
                                  identifier:
                                    artists[i].artist.identifier[0].mbid // A LINK TO HIS SONGKICK PROFIL
                                });

                                newArtist.save((err, artist) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    // WE SAVE IT THEN WE PUSH THE INFOS THAT WE NEED IN AN ARRAY THAT WILL BE RETURN TO OUR USERS
                                    arrayArtists.push({
                                      artist: artist._id,
                                      position: artists[i].position
                                    });
                                    if (i === artists.length - 1) {
                                      console.log("arrayArtists", arrayArtists);
                                      const event = new Event({
                                        songKickId:
                                          response.data.resultsPage.results
                                            .event.id,
                                        venue: venue,
                                        popularity:
                                          response.data.resultsPage.results
                                            .event.popularity,
                                        uri:
                                          response.data.resultsPage.results
                                            .event.uri,
                                        title: response.data.resultsPage.results
                                          .event.displayName
                                          ? response.data.resultsPage.results
                                              .event.displayName
                                          : "",
                                        performance: arrayArtists,
                                        start:
                                          response.data.resultsPage.results
                                            .event.start,
                                        ageMin:
                                          response.data.resultsPage.results
                                            .event.ageRestriction,
                                        eventType:
                                          response.data.resultsPage.results
                                            .event.type
                                      });
                                      console.log;
                                      event.save(function(err) {
                                        if (err) {
                                          return res.json(err.message);
                                        } else {
                                          return res.json({
                                            response: response.data
                                          });
                                        }
                                      });
                                    }
                                  }
                                });
                              }
                            }
                          });
                        }
                      }
                    });
                  }
                }
              });
            });
        } else {
          res.json(obj);
        }
      }
    });
});

module.exports = router;
