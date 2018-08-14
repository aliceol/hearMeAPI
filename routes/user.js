var express = require("express");
var router = express.Router();
var uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const axios = require("axios");

var isAuthenticated = require("../middlewares/isAuthentificated");
var uploadPictures = require("../middlewares/uploadPictures");

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
  User.findOne({ "account.email": req.body.email })
    .populate("")
    .exec(function(err, user) {
      if (err) return next(err.message);
      if (user) {
        if (
          SHA256(req.body.password + user.salt).toString(encBase64) ===
          user.hash
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

router.get("/like/artist/:id", isAuthenticated, function(req, res, next) {
  Artist.findOne({ songKickId: req.params.id })
    .populate("artist")
    .exec((err, artist) => {
      if (err) {
        res.json(err);
      } else {
        if (req.user.favArtists.indexOf(artist._id) !== -1) {
          const index = req.user.favArtists.indexOf(artist._id);
          req.user.favArtists.splice(index, 1);
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
        } else {
          req.user.favArtists.push(artist);
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
      }
    });
});

router.get("/add/event/:id", isAuthenticated, function(req, res, next) {
  Event.findOne({ songKickId: req.params.id }).exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      if (req.user.events.indexOf(event._id) !== -1) {
        const index = req.user.events.indexOf(event._id);
        req.user.events.splice(index, 1);
        // WE DELETE IT FROM THE ARRAY
        req.user.save(function(err) {
          // THEN SAVE
          if (err) {
            return next(err.message);
          } else {
            return res.json({
              events: req.user.events
            });
          }
        });
      } else {
        req.user.events.push(event);

        req.user.save(function(err) {
          // THEN SAVE IT
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
  });
});

router.get("/getMyLikes", isAuthenticated, function(req, res) {
  if (req.user) {
    const myArtists = [];
    const promises = [];
    for (let i = 0; i < req.user.favArtists.length; i++) {
      promises.push(Artist.findOne({ _id: req.user.favArtists[i] }));
    }
    Promise.all(promises).then(artists => {
      res.json(artists);
    });
    /*   Artist.findOne({ _id: req.user.favArtists[i] }).exec((err, artist) => {
        if (err) {
          res.json(err);
        } else {
          myArtists.push(artist);
          if (i === req.user.favArtists.length - 1) {
            res.json(myArtists);
          }
        }
      }); */
  } else {
    res.json({ error: "there is an error" });
  }
});

router.get("/getMyCalendar", isAuthenticated, function(req, res) {
  if (req.user) {
    const promises = [];
    for (let i = 0; i < req.user.events.length; i++) {
      promises.push(
        Event.findOne({ _id: req.user.events[i] })
          .populate("performance.artist")
          .populate("venue")
      );
    }

    Promise.all(promises).then(events => {
      res.json(events);
    });
  } else {
    res.json({ error: "there is an error" });
  }
});

router.get("/getMyInfo", isAuthenticated, function(req, res) {
  if (req.user) {
    res.json(req.user.account.userName);
  } else {
    res.json({ error: "there is an error" });
  }
});

router.post("/uploadPicture", isAuthenticated, uploadPictures, function(
  req,
  res
) {
  if (req.pictures.length) {
    res.json(req.pictures[0]);
  } else {
    res.json({ error: "there is an error" });
  }
});

module.exports = router;
