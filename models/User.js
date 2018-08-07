var mongoose = require("mongoose");
var Liana = require("forest-express-mongoose");

const UserSchema = new mongoose.Schema({
  account: {
    userName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    profilePic: String
  },
  loc: [],
  favArtists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist"
    }
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  ],
  hash: String,
  salt: String,
  token: String
});

Liana.collection("User", {
  fields: [
    {
      field: "Utilisateur",
      type: "String",
      get: function(object) {
        return object.account.userName;
      }
    }
  ]
});

Liana.collection("User", {
  fields: [
    {
      field: "Email",
      type: "String",
      get: function(object) {
        return object.account.email;
      }
    }
  ]
});

module.exports = mongoose.model("User", UserSchema, "users");
