# Lab 3 REST API

## How to Run

```bash
npm install
npm run server
```

The server runs on:

```text
http://localhost:3000
```

## How to Test

```bash
npm test
```

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/items` | Return all items |
| GET | `/items/:id` | Return one item |
| POST | `/items` | Create one item |
| PUT | `/items/:id` | Update one item |
| DELETE | `/items/:id` | Delete one item |

## Reflection Answers

### 1. What makes this API more REST-like than the previous HTTP/JSON lab?

Express is more REST-like by using principles such as routing, middleware, and standardized methods.

### 2. What is the purpose of a route parameter such as `/items/:id`?

The route parameter "id" is an input parameter. This tells the server that we want to do something specific to the object with the given ID. In our server, we have GET /items/:id, PUT /items/:id, and DELETE /items/:id. The GET method returns the item with the given ID, the PUT method updates the name and quantity of the item with the given ID, and the DELETE method deletes the item with the given ID.

### 3. Why should `POST`, `PUT`, and `DELETE` use different HTTP methods?

POST, PUT, and DELETE are all not safe methods. Additionally, PUT and DELETE are idempotent, meaning they can be rerun multiple times and the final state stays the same. POST is not idempotent. If you rerun the same POST command multiple times in our server, multiple items will be created with different IDs but the same names and quantities.

### 4. What is the difference between a `400` error and a `404` error?

400 is a "Bad Request" error, meaning the user has made an error in their request. In our server, this is an invalid name or quantity parameter when constructing PUT and POST requests. 404 is a "Not found" error, and it means the request is valid, but nothing was found that matches up with that request. In our server, this is a given ID that is not one of the IDs stored in the database.

### 5. How does the OpenAPI file relate to your Express server code?

The OpenAPI describes everything about the Express server code. It describes the server that the code runs on, each valid path, any input that may be required, all possible responses, descriptions of everything, and examples of everything.

## Graduate Extension

I added error checking for the PUT and POST routes. First, I ensure that the input "name" parameter is a nonempty string. I then check that the "quantity" parameter is not NaN and is greater than zero. If either of these parameters is invalid, the server returns a 400 error code with a message that reads **error: "Invalid or missing data."** returned as a JSON object. I also included four extra tests in **server.test.js**. There are two tests to check for an empty "name" parameter for the PUT and the POST routes, and two tests to check for a negative "quantity" parameter for the PUT and POST routes. These tests ensure that the 400 error code was returned.
