const scrapeIt = require("scrape-it");

getEventImage = link =>
  new Promise((resolve, reject) => {
    scrapeIt(link, {
      title: "h1 > span > a",
      image: {
        listItem: ".profile-picture-wrapper",
        data: {
          src: {
            selector: "img",
            attr: "src"
          }
        }
      },
      additionalDetails: {
        listItem: ".additional-details",
        data: {
          text: {
            selector: ".additional-details-container > p"
          }
        }
      },
      biographies: {
        listItem: ".artist-biographies > ul > li",
        data: {
          link: {
            selector: "a",
            attr: "href"
          },
          artistName: {
            selector: "a > strong"
          },
          artistBio: {
            selector: ".artist-biography > .standfirst > p"
          }
        }
      }
    }).then(({ data, response }) => {
      if (response.statusCode !== 200) {
        reject({ error: "an error occured ⚠️" });
      } else {
        resolve(data);
      }
    });
  });

module.exports = getEventImage;
