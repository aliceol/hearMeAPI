const scrapeIt = require("scrape-it");

getData = link =>
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
      console.log(`Status Code: ${response.statusCode}`);
      if (response.statusCode !== 200) {
        reject({ error: "an error occured ⚠️" });
      } else {
        resolve(data);
      }
    });
  });

/* scrapeIt(
    "https://www.songkick.com/concerts/33155944-puerto-candelaria-at-unknown-venue",
    {
      title: "h1 > span > a",
      image: {
        listItem: ".profile-picture-wrapper",
        data: {
          src: {
            selector: "img",
            attr: "src"
          }
        }
      }
    }
  ).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`);
    if (response.statusCode !== 200) {
      res.json({ error: "an error occured ⚠️" });
    } else {
      res.json(data);
    }
  }); */

/* getData(
  "https://www.songkick.com/concerts/32763419-altj-at-furstenberg-festivalbuhne"
); */

module.exports = getData;
