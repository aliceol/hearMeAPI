// import Cloudinary

const cloudinary = require("cloudinary");
require("dotenv").config();

// Setting up cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadPictures = (req, res, next) => {
  //initialize an empty array for my uploaded images
  const pictures = [];
  // I retrieve a array with the files
  const files = req.body.files;
  // I initialize the number of uploads to zero
  let filesUploaded = 0;
  // for each file in the array, I create an upload to Cloudinary

  if (files.length) {
    files.forEach(file => {
      // create a specific name for the photo
      cloudinary.v2.uploader.upload(
        file,
        {
          //Assign a specific folder in Cloudinary for each user
          public_id: `hearme/${req.user.id}`
        },
        (error, result) => {
          if (error) {
            // if there is an error upload, I get out of my route
            console.log("error", error);
            return res.status(500).json({ error });
          }
          // else i push my image to to the array
          pictures.push(result);
          // and I increment the amount of uploaded images
          filesUploaded++;

          // if the amount of uploaded pictures === the amount of sent files
          if (filesUploaded === files.length) {
            req.pictures = pictures;
            next();
          }
        }
      );
    });
  } else {
    next();
  }
};

module.exports = uploadPictures;
