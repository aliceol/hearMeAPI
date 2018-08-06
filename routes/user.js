var express = require("express");
var router = express.Router();
var uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const axios = require("axios");

var isAuthenticated = require("../middlewares/isAuthentificated");

var Event = require("../models/Event.js");
var Artist = require("../models/Artist.js");
var Venue = require("../models/Venue.js");
var User = require("../models/User.js");

router.post("/sign_up", function(req, res, next) {
  const token = uid2(64);
  const salt = uid2(64);
  const hash = SHA256(req.body.password + salt).toString(encBase64);

  const user = new User({
    account: {
      userName: req.body.userName,
      email: req.body.email
    },
    token: token,
    salt: salt,
    hash: hash
  });

  user.save(function(err) {
    if (err) {
      return next(err.message);
    } else {
      return res.json({
        _id: user._id,
        token: user.token,
        account: user.account
      });
    }
  });
});

router.post("/log_in", function(req, res, next) {
  User.findOne({ "account.email": req.body.email }).exec(function(err, user) {
    if (err) return next(err.message);
    if (user) {
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        return res.json({
          _id: user._id,
          token: user.token,
          account: user.account
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return next("User not found");
    }
  });
});

// A ROUTE TO ADD AND REMOVE ARTIST FROM THE USER4S FAVORITES

router.get("/like/artist/:id", isAuthenticated, function(req, res) {
  axios
    .get(
      "https://api.songkick.com/api/3.0/artists/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET
    )
    .then(function(response) {
      if (req.user.favArtists.indexOf(req.params.id) !== -1) {
        // IF THE ARTIST ALREADY EXIST IN HIS OR HER FAVORITES
        for (let i = 0; i < req.user.favArtists.length; i++) {
          if (req.user.favArtists[i] === req.params.id) {
            req.user.favArtists.splice(i, 1);
            // WE DELETE IT FROM THE ARRAY
            req.user.save(function(err) {
              // THEN SAVE
              if (err) {
                return next(err.message);
              } else {
                return res.json({
                  favArtists: req.user.favArtists
                });
              }
            });
          }
        }
      } else {
        // IF IT DIDN'T NOT EXIST YET
        req.user.favArtists.push(req.params.id);
        // WE PUSH IT IN THE ARRAY

        req.user.save(function(err) {
          // THEN SAVE IT
          if (err) {
            return next(err.message);
          } else {
            return res.json({
              favArtists: req.user.favArtists
            });
          }
        });
      }
    })
    .catch(function(error) {
      res.status(404).json("Page introuvable");
    });
});

router.get("/add/event/:id", isAuthenticated, function(req, res) {
  axios
    .get(
      "https://api.songkick.com/api/3.0/events/" +
        req.params.id +
        ".json?apikey=" +
        process.env.SONGKICK_API_SECRET
    )
    .then(function(response) {
      // IF THE EVENR ALREADY EXIST IN THE ARRAY, WE DELETE IT
      if (req.user.events.indexOf(req.params.id) !== -1) {
        for (let i = 0; i < req.user.events.length; i++) {
          // WE FOUND IT ITH A FOR
          if (req.user.events[i] === req.params.id) {
            req.user.events.splice(i, 1);
            // DELETE IT WHEN WE FOUND IT
            req.user.save(function(err) {
              // THEN SAVE THE ARRAY
              if (err) {
                return next(err.message);
              } else {
                return res.json({
                  events: req.user.events
                });
              }
            });
          }
        }
      } else {
        // IF THE EVENT DOES NOT EXIST YET
        req.user.events.push(req.params.id);
        // WE PUSH IT IN THE ARRAY

        req.user.save(function(err) {
          // THEN WE SAVE IT
          if (err) {
            return next(err.message);
          } else {
            return res.json({
              events: req.user.events
            });
          }
        });
      }
    })
    .catch(function(error) {
      res.status(404).json("Page introuvable");
    });
});

module.exports = router;
