// Le package `dotenv` permet de pouvoir definir des variables d'environnement
// dans le fichier `.env` Nous utilisons le fichier `.slugignore` afin d'ignorer
// le fichier `.env` dans l'environnement Heroku
require("dotenv").config();

// Le package `mongoose` est un ODM (Object-Document Mapping) permettant de
// manipuler les documents de la base de données comme si c'étaient des objets
var mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true
  },
  function(err) {
    if (err) console.error("Could not connect to mongodb.");
  }
);

var express = require("express");
var app = express();

// Parse le `body` des requêtes HTTP reçues
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" })); // L'upload est fixée à 50mb maximum (pour l'envoi de fichiers)

//

app.use(
  require("forest-express-mongoose").init({
    modelsDir: __dirname + "/models", // Your models directory.
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    mongoose: require("mongoose") // The database connection.
  })
);

// `Cross-Origin Resource Sharing` est un mechanisme permettant d'autoriser les
// requêtes provenant d'un nom de domaine different Ici, nous autorisons l'API
// à repondre aux requêtes AJAX venant d'autres serveurs
// var cors = require("cors");
// app.use("/api", cors());

// Les routes sont séparées dans plusieurs fichiers
const cityRoutes = require("./routes/city.js");
const artistRoutes = require("./routes/artist.js");
const venuesRoutes = require("./routes/venues.js");
const userRoutes = require("./routes/user.js");
const eventRoutes = require("./routes/event.js");

// // Les routes relatives aux utilisateurs auront pour prefix d'URL `/user`
app.use("/api/city", cityRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/venues", venuesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/event", eventRoutes);

// Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront
// une erreur 404
app.all("*", function(req, res) {
  res.status(404).json({ error: "Not Found" });
});

// Le dernier middleware de la chaîne gérera les d'erreurs Ce `error handler`
// doit définir obligatoirement 4 paramètres Définition d'un middleware :
// https://expressjs.com/en/guide/writing-middleware.html
app.use(function(err, req, res, next) {
  if (res.statusCode === 200) res.status(400);
  console.error(err);

  // if (process.env.NODE_ENV === "production") err = "An error occurred";
  res.json({ error: err });
});

app.listen(process.env.PORT, function() {
  console.log(`HearMe API running on port ${process.env.PORT}`);
});
