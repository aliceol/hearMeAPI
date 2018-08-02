require("dotenv").config();
const axios = require("axios");

//TO SAVE THE DATA I NEED TO IMPORT THE DIFFERENT SCHEMAS

var Event = require("../models/Event.js");
var Artist = require("../models/Artist.js");
var Venue = require("../models/Venue.js");

function doesEventExists(id, res) {
  Event.findOne({ songKickId: id }).exec((err, obj) => {
    if (err) {
      // IF THIS ID ISN'T RELATED TO AN EVENT
      /* res.status(400).json({ error: "An error occured" }); */
      return { error: "An error occured" };
    } else {
      return obj;
    }
  });
}

module.exports = { doesEventExists };
