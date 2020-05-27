const fs = require("fs");
const songs = JSON.parse(fs.readFileSync(`api/songs.json`));

for (let i = 0; i < songs.length; i++) {
  const song = songs[i];
  try {
    fs.readFileSync(`api/${song.id}.txt`);
  } catch {
    console.log(`Lyrics not found for ${song.name} by ${song.artist}`);
  }
}
