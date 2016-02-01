# api-weekend-sprint-jan
48 hour test api rapid prototype

## Overview
This API runs on port 4000 and accepts/returns json responses for the following endpoints:

- POST /register
- POST /login
- GET /users
- GET /users/<user_id>
- PUT /users/<user_id>
- DELETE /users/<user_id>
- GET /search?q=<query>
- GET /search/history
- GET /search/history/<user_id>
- GET /search/giphy/translate?q=<query>

Note: prepend all routes with 'api'.

## Example route
```http:/localhost:4000/api/register```

## Unauthenticated Routes
Minimal functionality is allowed for unauthenticated users. Unauthenticated users are only allowed to register and log in.

### /register & /login

POST the following json to the respective endpoint:
```
{
  "username": "USERNAME",
  "pwd": "PASSWORD"
}
```

## Authenticated Routes
This API uses Basic Authentication Scheme and only authenticates registered users for the following routes:

### GET /users
Returns all users in the database. This is also used in middleware to validate authorization headers

### GET /users/<user_id>
Returns a single user object

### PUT /users/<user_id>
Updates a single user object with the following fields:
- firstName
- lastName
- email
- phone

### DELETE /users/<user_id>
Deletes a single user from the database

### GET /search?q=<query>
Queries the database (and logs queries) for all users matching the following indexed fields:
- count
- firstName
- lastName
- email
- username

### GET /search/history
Returns full history of all queries with the following fields:
- count
- query
- timestamp
- user
- results (experimental)

### GET /search/history/<user_id>
Return all queries for a single user. The user's name is separated into a separate object for easier parsing on the frontend. Otherwise the returned field are identical to the full search history.

### GET /search/giphy/translate?q=<query>
Accepts are query and finds a suitable animated GIF relevant to the search query. The queries are also logged and integrated into the search history.

### How do we know who searched what?
All search queries parse a 'user-id' header which should be set with the authenticated user's '_id' on the frontend immediately afte the user is successfully authenticated.
