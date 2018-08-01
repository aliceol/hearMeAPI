const express = require("express");
const app = express();
var router = express.Router();
// var isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();
const axios = require("axios");

// ROUTE HOME AVEC METRO AREA PREDEFINIE. IL FAUDRA LA FAIRE VENIR
// DES INFOS DU USER POUR LUI DONNER LES EVENTS PROCHE DE CHEZ LUI
// CETTE ROUTE CORRESPOND AUX UPCOMING EVENTS

router.get("/:id", function(req, res) {
  // THE METRO AREA LOOK LIKE A NUMBER
  // FOR EXEMPLE PARIS IN FRANCE IS 28909
  axios
    .get(
      "https://api.songkick.com/api/3.0/metro_areas/" +
        req.params.id +
        "/calendar.json?apikey=" +
        process.env.SONGKICK_API_SECRET
    )
    .then(function(response) {
      res.json({ response: response.data });
    })
    .catch(function(error) {
      res.json({ response: error });
    });
});

module.exports = router;
