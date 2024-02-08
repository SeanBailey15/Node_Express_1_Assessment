const axios = require("axios");
const ExpressError = require("./expressError");

/*
First checks if the property of developers is included in the request body. If not, throws an Error.
Iterates over the request body, gathering usernames submitted through the POST request, and creates
an axios.get request to the endpoint using each username.
Then gathers the promises into an array: allPromises.
Sets res.locals.allPromises property in order to forward the variable for the life of the request/response cycle.
Finally, catches the error, checks if the err is an AxiosError due to a 404 error for an invalid username.
Creates a custom error for that particular condition, or passes other errors to the generic error middleware(app.js)
*/

async function gatherPromises(req, res, next) {
  let allPromises = [];

  try {
    if (!req.body.developers)
      throw new ExpressError(
        "Requires JSON request body: {developers: [username, ...]}",
        400
      );

    for (let d of req.body.developers) {
      allPromises.push(await axios.get(`https://api.github.com/users/${d}`));
    }

    res.locals.allPromises = allPromises;

    return next();
  } catch (err) {
    if (err instanceof axios.AxiosError)
      return next(new ExpressError("One Or More Invalid Users Requested", 400));
    return next(err);
  }
}

/*
First, retrieves allPromises from the res.locals object.
Creates an empty array: data.
Utilize Promise.all to iterate over allPromises and return an array of fullfillment values.
Iterate over that array and push objects containing only the necessary values to the data array.
Set res.locals.data property to equal the data array.
Finally, catch any error and pass it to the generic error handler middleware(app.js)
*/

async function retrieveData(req, res, next) {
  let allPromises = res.locals.allPromises;
  let data = [];

  await Promise.all(allPromises)
    .then((results) => {
      results.forEach((r) => {
        let values = r.data;
        data.push({ name: values.name, bio: values.bio });
      });
      res.locals.data = data;
      return next();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  gatherPromises,
  retrieveData,
};
