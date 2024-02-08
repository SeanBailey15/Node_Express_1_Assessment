const express = require("express");
const ExpressError = require("./expressError");
const middleware = require("./middleware");

const app = express();

app.use(express.json());

/*
Original code before fixes:

app.post('/', function(req, res, next) {
  try {
    let results = req.body.developers.map(async d => {
      return await axios.get(`https://api.github.com/users/${d}`);
    });
    let out = results.map(r => ({ name: r.data.name, bio: r.data.bio }));

    return res.send(JSON.stringify(out));
  } catch {
    next(err);
  }
});
*/

/* 
Original code with fixes, see issues.md for more information about changes:

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

/* ***************************************************************************
Refactored code below:
See other modules for more details.
*/

app.post(
  "/",
  middleware.gatherPromises,
  middleware.retrieveData,
  async (req, res, next) => {
    let out = await res.locals.data;
    return res.status(200).json(out);
  }
);

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
