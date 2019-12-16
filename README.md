# Movies REST API

A simple REST API for querying and performing CRUD operations on a collection of movies and users. 

## Project Goals

This project is meant to showcase a very simple REST API implementation, using knowledge I picked up from Andrew Mead's [The Complete Node.js Developer Course](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) Udemy tutorial series, as well as a few other sources.

I'm working through the following concepts in this project:

- Basic CRUD operations
- Basic API authentication
- Utilizing Mongoose for working with MongoDB

I will be blogging as I work through creating this app and committing the file to the repo. It can be viewed at [Dev Blog](https://github.com/Dayun123/movies-rest-api/blob/master/dev-blog.md).

In addition to the dev blog, I have a document that will track my TODO's for the project at [TODO](https://github.com/Dayun123/movies-rest-api/blob/master/TODO.md).

## Caveats

As I'm trying to understand the Express framework at a very basic level, I will *NOT* be using:

- Any client-side technology
- Security best-practices
- Testing

## Installation

Clone the repo and run `npm install`:

```bash
$ git clone git@github.com:Dayun123/movies-rest-api.git
$ npm install
```

Ensure you have a `mongod` instance running, and then populate the db with some stock movies and users (you must enter a database name in place of `{dbName}`):

```bash
$ npm run db {dbName}
```

Note the output of this command, as it will include the api key neccessary to access the `root` account.

```bash
$ root user created with api key: b67cd746-1647-484b-91cb-65d4a5afa483
```

The key will be stored in the root folder of the project at `rootApi.key` as well, in case you forget to copy down the console output of the command above.

If you need to destroy all the db data for some reason, a convenience script has been provided to do so:

```bash
$ npm run flush-db
```

## Usage

Start the server:

```bash
$ DEBUG=movies-rest-api:* npm run dev
```

All requests can then be made to the base url: `http://localhost:3000`

## Routes

Accepts requests at the following routes (replace `resource` with `users` or `movies`):

|  Method | Path          | Description           |
| --------| ------------- | ----------------------|
| GET     | /resource     | Return all resources  |
| GET     | /resource/:id | Return a resource     |
| POST    | /resource     | Create a resource     |
| PATCH   | /resource/:id | Update a resource     |
| DELETE  | /resource/:id | Delete a resource     |

## API Key

Access to most routes requires an `apiKey` query string parameter, with the sole exception being the `POST /users` route, as it is used to create a new user. 

#### Root Account

There is a `root` user that can perform CRUD operations on all users and movies, whose api key is auto-generated and printed to the console when the `npm run db` command is issued at installation. 

#### User Accounts

Individual users can only edit their own user account and add movies to the database, they cannot update or delete movies once they are stored in the db, only the root account can do that. The api key for individual users is auto-generated when `npm run db` populates the db upon installation, or when a new user account is created.

#### Example Requests

To get a listing of all movies, the following request would be neccessary using an example `user` accounts credentials:

`GET http://localhost:3000/movies?apiKey=5de5e9b4-8caa-4907-a4ba-47a60fa172ae`

To delete a user, the `root` account would make the following request (assuming the auto-generated api key is b67cd746-1647-484b-91cb-65d4a5afa483):

`DELETE http://localhost:3000/users/5deacae2059db33f2dfa0e4b?apiKey=b67cd746-1647-484b-91cb-65d4a5afa483`

## Search

To search for a movie, append the `keyword` query string to the `GET /movies` route, like so:

`GET http://localhost:3000/movies?apiKey=5de5e9b4-8caa-4907-a4ba-47a60fa172ae&keyword=mad+max`

The number of results can be filtered with the `numResults` query string parameter:

`GET http://localhost:3000/movies?apiKey=5de5e9b4-8caa-4907-a4ba-47a60fa172ae&keyword=batman&numResults=3`

## Response Format

### Success

Successful responses return a single resource, an array of resources, or a JSON object with `statusCode`, `statusMessage`, and `user` properties (`user` is used for example, `movie` is also valid):

|  Method | Path          | Return Value                                |
| --------| ------------- | --------------------------------------------|
| GET     | /users        | Array of users                              | 
| GET     | /users/:id    | Single user                                 |
| POST    | /users        | JSON with `statusCode`, `statusMessage`, and `user` properties  |
| PATCH   | /users/:id    | JSON with `statusCode`, `statusMessage`, and `user` properties   |
| DELETE  | /users/:id    | JSON with `statusCode`, `statusMessage`, and `user` properties  |

A request to `GET /users/1` would return:

```json
{
  "_id": "5deacae2059db33f2dfa0e4b",
  "username": "Marion24",
  "password": "REW4fs2sVmhtcsm",
  "email": "Sarai84@hotmail.com",
  "apiKey": "5de5e9b4-8caa-4907-a4ba-47a60fa172ae"
}
```

While a successful request to `POST /users` would return:

```json
{
  "statusCode": 201,
  "statusMessage": "User created",
  "user": {
    "_id": "5deacae2059db33f2dfa0e4b",
    "username": "Marion24",
    "password": "REW4fs2sVmhtcsm",
    "email": "Sarai84@hotmail.com",
    "apiKey": "5de5e9b4-8caa-4907-a4ba-47a60fa172ae"
  }
}
```

### Failure

Unsuccessful responses return a JSON object with `statusCode` and `statusMessage` properties detailing what went wrong.

Here is an example response for an authentication error:

```json
{
  "statusCode": 401,
  "statusMessage": "Must provide a valid API Key"
}
```

And here is an example response for a request that doesn't have the correct keys for creating a new movie:

```json
{
  "statusCode": 400,
  "statusMessage": "To create a movie the title, overview, and releaseDate keys are required"
}
```

## Creating A Resource

To create a user, send a JSON object in the request body with the format:

```json
{
  "username": "Marion24",
  "password": "REW4fs2sVmhtcsm",
  "email": "Sarai84@hotmail.com"
}
```

To create a movie, send a JSON object in the request body with the format:

```json
{
  "title": "Aladdin",
  "overview": "A kindhearted street urchin named Aladdin embarks on a magical adventure after finding a lamp that releases a wisecracking genie while a power-hungry Grand Vizier vies for the same lamp that has the power to make their deepest wishes come true.",
  "releaseDate": "1994-09-23"
}
```

Users require a `username`, `password`, and `email` while movies require `title`, `overview`, and `releaseDate` fields.

A request to create a resource should have the header `Content-Type: application/json` or it will be rejected.