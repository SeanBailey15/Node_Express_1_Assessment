### Conceptual Exercise

Answer the following questions below:

### What are some ways of managing asynchronous code in JavaScript?  
  
-  We can manage asynchronous code in JavaScript using async tasks such as ```setTimeout```,
  using the ```fetch```,  ```then``` and ```catch``` methods, using the ```Promise``` object and ```XMLHttpRequest```, or using ```async/await```. We can also use the ```Axios``` library with Promises to further enhance and streamline the handling of requests and responses.
### What is a Promise?  

- A promise is placeholder for the future result of an asynchronous operation.

### What are the differences between an async function and a regular function?  

- Regular functions are known as "synchronous" functions, meaning the code will execute line by line in order. The second line cannot execute until the first line is finished, the third until the second is finished, etc. Asynchronous code can enable multiple tasks to execute at the same time, while allowing other code to execute while those tasks resolve.

### What is the difference between Node.js and Express.js?  

- Node.js is a JavaScript runtime environment and platform for building server-side apps. Express.js is a JavaScript web framework based on Node.js, used for building web apps.

### What is the error-first callback pattern?  

- The first argument of the callback accepts an error object. The second argument is reserved for successful data returned by the function. The callback is written in a way that it checks for the occurrence of an error first and handles the error if there is one, or it moves on to perform actions on the returned data.  

  ```js
  fs.readFile('/foo.txt', function(err, data) {
    if(err) {
      throw new Error();
    } else {
      console.log(data);
    }
  });
  ```

### What is middleware?  

- Middleware in Express are functions that have access to the ```request``` and ```response``` objects, as well as the ```next``` function. These functions can execute any code, make changes to the request and response objects, end the request-response cycle, and call the next middleware in the stack.

### What does the `next` function do?  

- The ```next``` function executes the middleware succeeding the current middleware.

### What are some issues with the following code? (consider all aspects: performance, structure, naming, etc)

```js
async function getUsers() {
  const elie = await $.getJSON('https://api.github.com/users/elie');
  const joel = await $.getJSON('https://api.github.com/users/joelburton');
  const matt = await $.getJSON('https://api.github.com/users/mmmaaatttttt');

  return [elie, matt, joel];
}
```

- One issue I can see with the above code is the potential performance issues of awaiting three separate responses from the API before returning the list. Depending on a user's internet speed, and what other functions or dom manipulation may be happening asynchronously, there could be a long delay between the request and response. 
- Another issue concerns the way the function is structured. It is most likely better to get one user at a time, and rename the function ```getUser```(singular). The function could accept a ```username``` as an argument that could be passed into the URL. If we wanted to update the function later on, perhaps to refine the data we choose to return, we would have to write three times the code to do so in the current function, once for each user we are requesting. Also, if we wanted to collect the data in a list for use elsewhere, we could push the data into a global list variable that exists outside the scope of this function.
- Beyond refactoring/simplifiying what is written in the example, there is the issue that here we would only return the promise objects, not the actual data recieved. There is no code to handle the resolved promise, nor a rejected one. There is no error handling either.