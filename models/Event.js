var mongoose = require("mongoose");
var Liana = require("forest-express-mongoose");

const EventSchema = new mongoose.Schema({
  songKickId: Number,
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue"
  },
  popularity: Number,
  uri: String,
  title: String,
  start: Object,
  ageMin: String,
  eventType: String,

  performance: [
    {
      artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist"
      },
      position: Number
    }
  ]
});

Liana.collection("users", {
  fields: [
    {
      field: "fullname",
      type: "String",
      get: function(object) {
        return object.firstName + " " + object.lastName;
      }
    }
  ]
});

Liana.collection("Event", {
  fields: [
    {
      field: "Date et Heure",
      type: "String",
      get: function(object) {
        return object.start
          ? `${object.start.date} ${object.start.time}`
          : "N/A";
      }
    }
  ]
});

Liana.collection("Event", {
  fields: [
    {
      field: "Age minimum",
      type: "String",
      get: function(string) {
        return string.ageMin ? string.ageMin : "N/A";
      }
    }
  ]
});

module.exports = mongoose.model("Event", EventSchema, "events");
