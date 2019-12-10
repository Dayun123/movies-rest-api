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


