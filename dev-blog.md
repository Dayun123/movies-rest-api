# Development Blog

I'm going to use this 'blog' as a place to summarize my work each day, or maybe just after each major section of the app is completed. I envision this document as a place where I can have a record of my thought process as the app evolves. 

## 12-09-2019

#### General Request -> Response Structure

Started working on the actual app structure today, as opposed to the README, db population, and general pre-planning that I had been doing for the past few days. I started and completed work on the POST /users route today. I'm not sure if I will keep the same structure throughout the project, but here is what I have so far for the POST /users route:

1. A request comes in to the route-handler.
2. Content-Type headers are validated first to ensure JSON is passed in.
3. Body of the request is passed to the db.create() to perform validations against the User model and save to the db.
4. db.create checks to make sure that the User data is valid, then saves the user to the database. It returns a JSON object on validation errors or success. If there is some sort of db connection error, it is not handled here, so an error is thrown.
5. The route handler recieves a response from the db.create() method, and returns it to the caller. If an error was thrown in db.create(), the catch() handler will pass this along to app-level error-handling middleware via a call to next(error).

#### Error Responses

I don't love the fact that an error response can be sent in three different places, but I think this is the correct way to handle this. Down the line, I may find a better solution. Right now, errors are handled:

- In the route-handler after sniffing the headers.
- In the db.js file, if validation errors occur. (The response itself is sent in the route-handler, but the object is created and returned in the db.js file)
- In the app.js file, as error-handling middleware. 

#### Development Workflow

My development workflow seems to be progressing as such:

1. Setup a Postman request (valid or invalid).
2. Setup a Postman test that has the expected response status code and status message.
3. Work on getting the expected response to this request.
4. Run the Postman Collection Runner after each new request is successfully handled to ensure that I didn't break anything in the other requests.

#### Postman Command-Line Tool

I would like to add Newman, a command-line tool for running Postman requests, to the project in the near future. I said I wasn't going to do testing on this project, but it seems like testing the HTTP requests is required, unless I want to pull my hair out manually checking all requests after each edit. 

## 12-10-2019

#### NPM Scripts

I added an npm script that allows the user to delete all users and movies from the database by running `npm run flush-db`. I mainly did this because I'm constantly needing to empty out the database and start over during development, so I wanted a quicker way to accomplish this task.

#### Database Name

I had hard-coded in the database name originally, but I decided that when the database is initially populated I would have the user enter in the database name like so: `npm run db {dbName}`. This required creating a `config.json` file in the root directory that will store the dbName, and then pulling the dbName from that file whenever a connection to the database is needed.

#### Trim The Fat

I created the app with `express-generator`, and as such there was some unneccessary stuff included in the app that I went ahead and removed, just so I wouldn't have to have the extra clutter.

#### GET /movies

Setup the route-handler for the `GET /movies` route, which requires a valid api key in order to access the Movies collection in the DB. Tested the route with valid and invalid api keys in Postman. Nothing too difficult about this route, and the `GET /users` route will be almost the same, except will be restricted to the root users api key only. 

## 12-11-2019

#### GET /movies/:id

Setup the route-handler for the `GET /movies/:id` route. There were some interesting problems to solve in this route-handler, namely, the fact that an invalid :id parameter could throw different errors depending on whether or not it was a valid ObjectID. Since mongoose tries to cast id params into an ObjectId, I would get a cast error when trying to search for a movie with an id parameter that was an invalid ObjectId. I found a neat way to solve this by using the `mongoose.Types.ObjectId.isValid()` method to check whether the id was a valid ObjectId BEFORE running the db query and throwing the cast error. 

This error provided me with another challenge though, since I wanted to send the same response for invalid ID's, regardless of whether they were invalid ObjectId's or just an id that didn't exist in the db. To keep the code dry, I decided to create an error object, and then return that if the ObjectID was invalid, or if no movie was returned from the Movie.find() call. Here is the relevant snippet, where `errorObj` is returned before a db call if the id is an invalid ObjectId, or after the db call if there is no doc found with that id:

```javascript

const errorObj = {
    statusCode: 400,
    statusMessage: `No ${Model.modelName.toLowerCase()} found with that id`,
  };

if (!mongoose.Types.ObjectId.isValid(_id)) return errorObj;

const [ doc ] = await Model.find({ _id });

if (!doc) return errorObj;

return {
  statusCode: 200,
  [Model.modelName.toLowerCase()]: doc,
};

```

I don't think I've used this pattern before, of creating an error object and then using it is different places. It works though!

#### db.read()

I refactored `db.read()` to work for reading all resources or a single resource, depending on whether or not a second parameter (id) was passed in. If no id param is passed in, the method just reads all the documents from the db. If an id parameter is passed in, some validation kicks in and a single document is returned. I'm not sure if this is good practice or not. In one sense, a method should do one thing. So, I should have a readAll method for getting all resources and a readOne() method for getting one resource. On the other hand, it's a simple check to see if an id param was passed in, and to run different logic. The method was 2 lines before, which hardly did anything:

```javascript
const Model = resourceType === 'user' ? User : Movie;
return await Model.find();
```

Now, there is more going on, but those two lines are executed right away in no id is passed in, or some other stuff happens if an id is passed in. 

#### Handling DB Errors

I'm still not sure how to best handle db related connection errors, or even what kind of errors to be guarding against for db calls. Currently, I'm just sticking db code in a try...catch, and then if an error is thrown I'm passing it along to app-level middleware and saying it's a 500 error. I'm sure this isn't the best way to handle things, but I haven't come across anything in my studies to show me the correct way to handle this at this point, so I'm going with this method!


