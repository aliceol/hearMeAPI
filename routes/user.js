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

router.get("/add/artist/:id", isAuthenticated, function(req, res) {
  axios
    .get(
      "https://api.songkick.com/api/3.0/artists/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET
    )
    .then(function(response) {
      console.log(response.data.resultsPage.results);
      if (req.user.favArtists.indexOf(req.params.id) !== -1) {
        res.json("L'artiste est déjà dans vos favoris");
      } else {
        req.user.favArtists.push(req.params.id);

        req.user.save(function(err) {
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
      console.log("oups");
      res.json({ response: error });
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
      console.log(response.data.resultsPage.results);
      if (req.user.events.indexOf(req.params.id) !== -1) {
        res.json("L'event est déjà dans vos favoris");
      } else {
        req.user.events.push(req.params.id);

        req.user.save(function(err) {
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
      console.log("oups");
      res.json({ response: error });
    });
});

router.get("/remove/artist/:id", isAuthenticated, function(req, res) {
  axios
    .get(
      "https://api.songkick.com/api/3.0/artists/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET
    )
    .then(function(response) {
      if (req.user.favArtists.indexOf(req.params.id) !== -1) {
        for (let i = 0; i < req.user.favArtists.length - 1; i++) {
          if (req.user.favArtists[i] === req.params.id) {
            req.user.favArtists.splice(i, 1);
            req.user.save(function(err) {
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
      }
    })
    .catch(function(error) {
      console.log("oups");
      res.json({ response: error });
    });
});

router.get("/remove/event/:id", isAuthenticated, function(req, res) {
  axios
    .get(
      "https://api.songkick.com/api/3.0/events/" +
        req.params.id +
        ".json?apikey=" +
        process.env.SONGKICK_API_SECRET
    )
    .then(function(response) {
      if (req.user.events.indexOf(req.params.id) !== -1) {
        for (let i = 0; i < req.user.events.length - 1; i++) {
          if (req.user.events[i] === req.params.id) {
            req.user.events.splice(i, 1);
            req.user.save(function(err) {
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
      }
    })
    .catch(function(error) {
      console.log("oups");
      res.json({ response: error });
    });
});

module.exports = router;
