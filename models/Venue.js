var mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema({
  songKickId: Number,
  name: String,
  uri: String,
  address: String,
  city: String,
  country: String,
  zip: String,
  lat: String,
  lng: String,
  description: String,
  website: String
});

module.exports = mongoose.model("Venue", VenueSchema, "venues");
