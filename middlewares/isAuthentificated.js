var User = require("../models/User.js");

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    User.findOne(
      { token: req.headers.authorization.replace("Bearer ", "") },
      function(err, user) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        if (!user) {
          return res.status(401).json({ error: "Unauthorized" });
        } else {
          console.log("authorized");
          req.user = user;
          return next();
        }
      }
    );
  } else {
    console.log("unauthorized");
    return res.status(401).json({ error: "Unauthorized" });
  }
};
