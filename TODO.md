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

## Return Users at GET /users

I'm only returning an array with an empty object at the `GET /users` route currently. I need to integrate the db.read() method into this route in my next coding session.

## ~~Tell README.md About This File~~

~~Need to include something in the README about the existence of this file and it's purpose.~~ [commit](https://github.com/Dayun123/movies-rest-api/commit/54fc3526256fd8134275b3da355a97a3f49de673)