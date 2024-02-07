# Broken App Issues  

1. Before beginning work I tested the functionality of the current code using the Insomnia REST client. The POST request did not return the expected information. Instead, it threw a ```ReferenceError: err is not defined```.  
   - The ```catch``` block of the POST route did not have an exception variable parameter, which caused the above ReferenceError. Added the parameter to the catch block.
  
2. Tried the POST route after fixing the above, threw a ```TypeError: Cannot read properties of undefined (reading 'developers')```. 
   - Needed to add the ```express.json()``` middleware to parse the request body

3. Next try threw ```TypeError: Cannot read properties of undefined (reading 'name')```.  
   - This was happening because the ```map()``` function does not wait for the promises to resolve and maps them to an array while they are still pending. Converted the route callback function into an async function. Then utilized and awaited ```Promise.all()``` on the map function, so the mapped array would contain the resolved values from all of the promises.  
  
4. Imports and config variables were not declared as constants.  
   - Easily fixed by using the proper declarations.

5. Finally, I have refactored the code according to Express.js best practices. This included:  
   - Adding a callback function to the app listener that will log a startup message to the console.
   - Moving the app listener to its own module called ```server.js```, exporting app from ```app.js```, and importing app into server.js. This allows us to perform integration testing more easily with testing libraries like Supertest.
   - Creating an ```ExpressError``` custom class for better error handling.
   - Adding error handling middleware to app.js.