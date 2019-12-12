# TODO

My TODO list for the project.

## Postman API Keys

I want to setup a way to pull a valid user api key from the database and insert that api key into the Postman requests where a valid user api key is neccessary. This should make it easier to download and install the app, then run the postman tests against the created app to ensure everything is hooked up correctly. Currently, you would need to configure Postman a little, but pulling a valid user api key from the db and inserting putting it in the valid postman requests. It seems like exporting the Postman collection of requests into the app, then dynamically adding the api keys for the correct routes on db population is the best way to accomplish this. Here is my thinking on how this will work:

1. User clones repo and installs dependencies
  - A postman.json file is included in the root directory that has all the postman requests.
2. When `npm run db {dbName}` is executed, a helper-function will populate the postman.json file with an apiKey from one of the newly created users.
3. The user will have to import the postman.json file into their version of postman, but maybe this can be done from the command line, as part of installation? May need newman npm package to accomplish this though.

## Nodemon Dev Dependency

Since I'm using Nodemon for development, I should included it as a dev depenency in the package.json file.

## Route-Handler Middleware Validation

Refactor movies router to use the `validate.js` file to run validations on incoming requests instead of doing this in the actual route-handler. I like the pattern developed in the users router, where each validation has it's own call to `router.use`:

```javascript
router.use(validate.apiKeyExistsInQS);
router.use(validate.rootApiKeyMatch);

router.get('/', async (req, res, next) => {
  // implement pulling all users from db
});
```

