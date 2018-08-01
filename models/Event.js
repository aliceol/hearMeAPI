var mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  songKickId: Number,
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue"
  },
  popularity: Number,
  uri: String,
  title: String,
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

module.exports = mongoose.model("Event", EventSchema, "events");
