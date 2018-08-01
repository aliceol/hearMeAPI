// const dotenv = require("dotenv").config();
// var mongoose = require("mongoose");
// mongoose.connect(
//   /* "mongodb://localhost:27017/HearMe-api" || */ process.env.MONGODB_URI,
//   { useNewUrlParser: true }
// );

// var express = require("express");
// var app = express();

// var bodyParser = require("body-parser");
// app.use(bodyParser.json());

// var AES = require("crypto-js/aes");
// const encBase64 = require("crypto-js/enc-base64");
// var SHA256 = require("crypto-js/sha256");

// const uid2 = require("uid2");

// const UserSchema = new mongoose.Schema({
//   account: {
//     userName: String,
//     email: String,
//     profilePic: String
//   },
//   loc: [],
//   favArtists: [String],
//   // events: [String],
//   hash: String,
//   salt: String,
//   token: String
// });

// const Users = mongoose.model("Users", UserSchema);

// function generateObj(obj) {
//   return {
//     _id: obj._id,
//     token: obj.token,
//     userName: obj.account.userName,
//     email: obj.account.email
//   };
// }

// app.post("/api/user/sign_up", function(req, res) {
//   const salt = uid2(64);
//   const token = uid2(12);

//   const thisUser = {
//     account: {
//       userName: req.body.account.userName,
//       email: req.body.account.email
//       // profilePic: null
//     },
//     loc: req.body.loc,
//     favArtists: req.body.favArtists,
//     hash: SHA256(req.body.password + salt).toString(encBase64),
//     salt,
//     token
//   };

//   let newUser = new Users(thisUser);

//   newUser.save(function(err, obj) {
//     if (!err) {
//       res.json(generateObj(obj));
//     } else {
//       res.json({ message: "There is an error!" });
//     }
//   });
// });

// app.listen(3001);

// {
// 	"account": {
// 		"userName": "Tal",
// 		"email" : "tal@lereacteur.io",
// 		"password" : "azerty"
// 	},
// 	"loc" :[ "48.8564449" , "2.4002913" ],
// 	"favArtists" : ["29835" , "68043"]

// }
