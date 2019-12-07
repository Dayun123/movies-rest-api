# Movies REST API

A simple REST API for querying and performing CRUD operations on a collection of movies and users.

## Project Goals

This project is meant to showcase a very simple REST API implementation, using knowledge I picked up from Andrew Mead's [The Complete Node.js Developer Course](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) Udemy tutorial series. 

I'm working through the following concepts in this project:

- Basic CRUD operations
- Utilizing Mongoose for working with MongoDB

## Caveats

As I'm trying to understand the Express framework at a very basic level, I will *NOT* be using:

- Any client-side technology
- Testing

## Installation

Clone the repo and run `npm install`:

```bash
$ git clone git@github.com:Dayun123/movies-rest-api.git
$ npm install
```

Ensure you have a `mongod` instance running, and then populate the db with some stock movies and users:

```bash
$ npm run db
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

Access to all routes requires an `apiKey` query string parameter, which is setup as `abc123` in the default app. 

So, to get a listing of all movies, the following request would be neccessary:

`GET http://localhost:3000/movies?apiKey=abc123`

## Search

To search for a movie, append the `keyword` query string to the `GET /movies` route, like so:

`GET http://localhost:3000/movies?apiKey=abc123&keyword=mad+max`

The number of results can be filtered with the `numResults` query string parameter:

`GET http://localhost:3000/movies?apiKey=abc123&keyword=batman&numResults=3`

## Response Format

### Success

Successful responses return a single resource, an array of resources, or a JSON object with `statusCode`, `statusMessage`, and `user` properties (`user` is used for example, `movie` is also valid):

|  Method | Path          | Return Value                                |
| --------| ------------- | --------------------------------------------|
| GET     | /users        | Array of users                              | 
| GET     | /users/:id    | Single user                                 |
| POST    | /users        | JSON with `statusCode`, `statusMessage`, and `user` properties  |
| PATCH   | /users/:id    | JSON with `statusCode`, `statusMessag`, and `user` properties   |
| DELETE  | /users/:id    | JSON with `statusCode`, `statusMessage`, and `user` properties  |

A request to `GET /users/1` would return:

```json
{
  "_id": "5deacae2059db33f2dfa0e4b",
  "username": "Marion24",
  "password": "REW4fs2sVmhtcsm",
  "email": "Sarai84@hotmail.com"
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
    "email": "Sarai84@hotmail.com"
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
  "statusMessage": "To create a movie the title, overview, and popularity keys are required"
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
  "popularity": 80.17 
}
```

You can add any fields you like, those are the ones that come 'stock' with the app and are required in order to create a new user or movie.

A request to create a resource should have the header `Content-Type: application/json` or it will be rejected.