# TODO

My TODO list for the project.

## Postman API Keys

I want to setup a way to pull a valid user api key from the database and insert that api key into the Postman requests where a valid user api key is neccessary. This should make it easier to download and install the app, then run the postman tests against the created app to ensure everything is hooked up correctly. Currently, you would need to configure Postman a little, but pulling a valid user api key from the db and inserting putting it in the valid postman requests. It seems like exporting the Postman collection of requests into the app, then dynamically adding the api keys for the correct routes on db population is the best way to accomplish this. Here is my thinking on how this will work:

1. User clones repo and installs dependencies
  - A postman.json file is included in the root directory that has all the postman requests.
2. When `npm run db {dbName}` is executed, a helper-function will populate the postman.json file with an apiKey from one of the newly created users.
3. The user will have to import the postman.json file into their version of postman, but maybe this can be done from the command line, as part of installation? May need newman npm package to accomplish this though.

## ~~Nodemon Dev Dependency~~

~~Since I'm using Nodemon for development, I should included it as a dev depenency in the package.json file.~~ [commit](https://github.com/Dayun123/movies-rest-api/commit/9b681233c0ce27a8edd97b5b3ab6d1e9d20062e7)

## ~~Route-Handler Middleware Validation~~

~~Refactor movies router to use the `validate.js` file to run validations on incoming requests instead of doing this in the actual route-handler. I like the pattern developed in the users router, where each validation has it's own call to `router.use`:~~ [commit](https://github.com/Dayun123/movies-rest-api/commit/9f64b05890598119353e780e6abd9b5a8dc6f989)

```javascript
router.use(validate.apiKeyExistsInQS);
router.use(validate.rootApiKeyMatch);

router.get('/', async (req, res, next) => {
  // implement pulling all users from db
});
```
## ~~Postman Tests~~

~~I need to understand how to use Postman tests better. I'm using them now, but I can't do very advanced stuff with them. For example, at the `GET /users` route, I don't know how to check to see if an array of user objects is returned, I only know how to see if an array comes back, and if there are objects in it. Need to find a way to validate that the objects have the correct keys. I know how to do this with array methods, but I'm not sure the correct way to structure the test code using the pm.test() methods.~~

## ~~Return Users at GET /users~~

~~I'm only returning an array with an empty object at the `GET /users` route currently. I need to integrate the db.read() method into this route in my next coding session.~~ [commit](https://github.com/Dayun123/movies-rest-api/commit/1b0ff9ff10349831ab4eda131ab46979f279e2a5)

## ~~Tell README.md About This File~~

~~Need to include something in the README about the existence of this file and it's purpose.~~ [commit](https://github.com/Dayun123/movies-rest-api/commit/54fc3526256fd8134275b3da355a97a3f49de673)

## ~~Refactor Users Router~~

~~I'm using the same pattern in the GET /users/:id and DELETE users/:id route-handlers:~~

```javascript

// const dbResponse = await db.performDeleteOrGetQuery();

// if (dbResponse.statusCode !== 200) {
//   return res.status(dbResponse.statusCode).json(dbResponse);
// }

// const isValidUser = await validate.currentUserOrRootUser(req.query.apiKey, dbResponse.user.apiKey);

// if (!isValidUser) {
//   return res.status(401).json({ statusMessage: 'API Key does not match the user id or the root user'});
// }

// res.status(dbResponse.statusCode).json(dbResponse);

```

~~These should be one route handler, possibly a call to router.param('id'), and then base the db query on the req.method.~~ [commit](https://github.com/Dayun123/movies-rest-api/commit/6ee0656a047c4a62cf780793a47ce91694de4a00)

## ~~Validate releaseDate in Create Movie~~

~~I don't have any logic in place to validate the releaseDate field when a new movie is created, this should be fixed.~~ *(turns out I did have this setup, but wasn't testing for it so I wasn't sure! That's fixed now)*

## ~~Response Objects Need A Single Point of Creation~~

~~In the dev blog, I noted [here](https://github.com/Dayun123/movies-rest-api/blob/master/dev-blog.md#get-usersid) that I was unhappy with how I was handling validation and how I was returning response objects. I need to find a way that consistently sets up response objects for success or failure in the same place. Right now, sometimes it happens in validation middleware, sometimes in db.js, sometimes in the actual route-handler. I think this is confusing.~~ *Fixed in a series of commits from* [commit](https://github.com/Dayun123/movies-rest-api/commit/3ad2290ac5e1bb14117874b3bfeda1a0421f14dc) *to* [commit](https://github.com/Dayun123/movies-rest-api/commit/bf1a942e4d3aa6229a3ccfdd8d4146717c76d7c1)

## ~~GET /resource/:id Pre-Request Scripts~~

~~Currently, in the Postman tests for the GET /users/:id and GET /movies/:id routes, the :id is hard-coded. I should pull this :id from a call to GET /users or GET /movies in a pre-request script instead. I could get all the movies, then pull the id of the first one and use that as the :id param in the request. This would be less error-prone and would allow me to populate the :id field on db creation eventually.~~

## ~~Read User (Valid API Key, Wrong User) Returns Incomplete Response~~

~~The postman test `Read User (Valid API Key, Wrong User) Returns Incomplete Response` is supposed to return an object with statusCode and statusMessage properties, but only returns the statusMessage. I should build in a test for this, right now it is passing but not returning a statusCode property.~~ [commit](https://github.com/Dayun123/movies-rest-api/commit/80507eb5e978e5cc33d148354286ca8850a45cf6)

## ~~Pre-Request Script To Grab User API Key~~

~~Right now, I have a hard-coded userApiKey environment variable in my Postman tests. This is bad, since that user could be deleted at some point. What I need is a pre-request script that calls GET /users and pulls the apiKey of the first user to populate the envirnoment userApiKey variable in postman. This pre-request script will need to be run on any route that uses userApiKey, which is a lot...~~

## ~~Root and User API Keys for all relevant Postman Requests~~

~~Some postman requests have User API Key versions but no Root API Key versions, and vice-versa. If a given route allows both Root and User api keys, I should be testing this.~~

## Investigate PUT vs. PATCH

I need to understand the difference between PUT and PATCH, and which one I should be using in this app. For now, I'm using PATCH, as it was what I used in the Udemy course, but I may change this after doing some research.

## Add Caveat About Server Errors

I need to add a caveat about not handling server errors to the README, or I need to find a way to handle server errors.

## Add Search Functionality

Want to be able to search by keyword and num_results.

## Add PATCH /movies

The last route-handler, should be easy.

