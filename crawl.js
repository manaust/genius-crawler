global.fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

const data = [
  {
    id: "790jZbOfjDsMjeWpxQ0H9T",
    title: "One",
    artist: "Metallica",
  },
];

const writeToFile = (text, i) => {
  console.log("Writing json to file...");
  fs.writeFile(`output/${i}.txt`, text, "utf8", (err) => {
    if (err) {
      console.error("An error occured while writing text to file.");
      return;
    }
    console.log("Text file has been saved.");
  });
};

// Try recursive fetch when error with reformatted title
const crawl = async (id, title, artist) => {
  const res = await fetch(
    `https://genius.com/${artist.toLowerCase()}-${title.toLowerCase()}-lyrics`
  );
  const data = await res.text();
  const $ = cheerio.load(data);
  let lyrics = $(".lyrics");
  writeToFile(lyrics.text().trim(), id);
};

for (let i = 0; i < data.length; i++) {
  crawl(data[i].id, data[i].title, data[i].artist);
}
