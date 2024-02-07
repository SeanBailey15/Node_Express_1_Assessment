const express = require("express");
const ExpressError = require("./expressError");
const axios = require("axios");
const app = express();

app.use(express.json());

/* Original code with fixes:

app.post("/", async function (req, res, next) {
  try {
    let results = await Promise.all(
      req.body.developers.map(async (d) => {
        return await axios.get(`https://api.github.com/users/${d}`);
      })
    );
    let out = results.map((r) => ({ name: r.data.name, bio: r.data.bio }));

    return res.send(JSON.stringify(out));
  } catch (err) {
    next(err);
  }
});
*/

// Refactored code below:

app.post("/", async (req, res, next) => {
  try {
    if (!req.body.developers)
      throw new ExpressError(
        "Requires JSON request body: {developers: [username, ...]}",
        400
      );

    let results = await Promise.all(
      req.body.developers.map(async (d) => {
        return await axios.get(`https://api.github.com/users/${d}`);
      })
    );

    let out = results.map((r) => ({
      name: r.data.name,
      bio: r.data.bio,
    }));

    return res.status(200).json(out);
  } catch (err) {
    return next(err);
  }
});

// Generic 404 Error handler:

app.use((req, res, next) => {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

// Explicit Error handler:

app.use((err, req, res, next) => {
  let message = err.msg || "Internal Server Error";
  let status = err.status || 500;
  return res.status(status).json({
    error: {
      message: message,
      status: status,
    },
  });
});

module.exports = app;
