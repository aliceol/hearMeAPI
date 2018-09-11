var mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
  uri: String,
  displayName: String,
  songKickId: Number,
  identifier: String,
  pictureURI: String
});

module.exports = mongoose.model("Artist", ArtistSchema, "artists");
