const axios = require("axios");
const fs = require("fs");

function handleOutput(pathOut, text) {
  fs.writeFile(pathOut, text, "utf8", (err) => {
    if (err) {
      console.error(`ERROR: Couldn't write to ${pathOut}`);
    }
    console.log(`Wrote to ${pathOut}`);
  });
}

async function getData(arr) {
  for (const url of arr) {
    try {
      const res = await axios.get(url);
      let pathOut = res.request.host.replace("www.", "");
      let text = res.data;
      handleOutput(pathOut, text);
    } catch (err) {
      console.error(`ERROR: Couldn't download ${err.config.url}`);
    }
  }
}

function getUrls(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(`ERROR: Couldn't read ${path}:\n`, err);
      process.exit(1);
    }
    let urls = data.trim().replace(/\r\n/g, "\n").split("\n");
    getData(urls);
  });
}

let path = process.argv[2];

getUrls(path);
