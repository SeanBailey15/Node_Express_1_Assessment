const axios = require("axios");
const fs = require("fs");

// function handleOutput(path, text) {
//     fs.writeFile(path, text, "utf8", (err) => {
//         if (err) {
//             console.error()
//         }
//     })
// }

async function getData(arr) {
  for (const url of arr) {
    try {
      const res = await axios.get(url);
      let path = res.request.host.replace("www.", "");
      let text = res.data;
      handleOutput(path, text);
    } catch (err) {
      console.error(`ERROR: Couldn't download ${err.config.url}`);
    }
  }
}

function getFiles(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(`ERROR READING ${path}:\n`, err);
      process.exit(1);
    }
    let urls = data.trim().replace(/\r\n/g, "\n").split("\n");
    getData(urls);
  });
}

let path = process.argv[2];

getFiles(path);
