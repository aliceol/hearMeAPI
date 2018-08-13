const scrapeIt = require("scrape-it");

getArtistImage = link =>
  new Promise((resolve, reject) => {
    scrapeIt(link, {
      image: {
        listItem: ".profile-picture-wrap > a",
        data: {
          src: {
            selector: "img",
            attr: "src"
          }
        }
      }
    }).then(({ data, response }) => {
      if (response.statusCode !== 200) {
        reject({ error: "an error occured ⚠️" });
      } else {
        resolve(data.image);
      }
    });
  });

module.exports = getArtistImage;
