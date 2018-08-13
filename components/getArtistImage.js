const scrapeIt = require("scrape-it");

getArtistImage = link =>
  new Promise((resolve, reject) => {
    scrapeIt(link, {
      title: "h1 > span > a",
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
      console.log(`Status Code: ${response.statusCode}`);
      if (response.statusCode !== 200) {
        reject({ error: "an error occured ⚠️" });
      } else {
        resolve(data);
      }
    });
  });

module.exports = getArtistImage;
