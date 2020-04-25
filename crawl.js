global.fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

const formatLyrics = (text) => {
  return text
    .replace(/\[.*?[^\)]\]/g, "") // Remove text between brackets
    .replace(/(\r\n|\r|\n){2,}/g, "$1\n") // Remove redundant newlines
    .trim();
};

const format = (input) => {
  let formatted = input;
  if (formatted.indexOf(" -") != -1) {
    formatted = formatted.substring(0, input.indexOf(" -"));
  }
  if (formatted.indexOf(" (feat.") != -1) {
    formatted = formatted.substring(0, input.indexOf(" (feat."));
  }
  return formatted
    .replace("Metalocalypse: ", "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents from characters
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/\&/g, "and")
    .replace(/\//g, "-")
    .replace(/\!/g, "")
    .replace(/\?/g, "")
    .replace(/\,/g, "")
    .replace(/\./g, "")
    .replace(/\'/g, "")
    .replace(/\(|\)/g, "");
};

const writeToFile = (text, i) => {
  fs.writeFile(`output/${i}.txt`, text, "utf8", (err) => {
    if (err) {
      console.error("An error occured while writing text to file.");
      return;
    }
    console.log("Text file has been saved.");
  });
};

// Try recursive fetch when error with reformatted name
const crawl = async (id, name, artist) => {
  console.log(`Fetching url ${format(artist)}-${format(name)}-lyrics`);
  const res = await fetch(
    `https://genius.com/${format(artist)}-${format(name)}-lyrics`
  );
  const data = await res.text();
  const $ = cheerio.load(data);
  let lyrics = $(".lyrics").text().trim();

  if (lyrics == null || lyrics == "") {
    console.log(`Lyrics not found for ${name} by ${artist}`);
  } else {
    writeToFile(formatLyrics(lyrics), id);
  }
};

// Fetch all song lyrics
const data = JSON.parse(fs.readFileSync(`output/input.json`));

for (let i = 0; i < data.length; i++) {
  crawl(data[i].id, data[i].name, data[i].artist);
}
