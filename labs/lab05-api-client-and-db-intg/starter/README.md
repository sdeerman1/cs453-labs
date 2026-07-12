# Lab 5 Starter

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What Already Works

- Postgres runs in Docker.
- The Express server connects to Postgres.
- The server creates and seeds an `items` table on startup.
- `GET /health`, `GET /api/items`, and `POST /api/items` are implemented.
- The browser client can load items and add a new item.

## What You Need to Add

- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- Better validation and error handling
- Client-side UI for at least some of the new routes  
I added in the routes and error handling, and the client-side UI now includes options to replace an item (PATCH) and delete an item (DELETE).

## Graduate Extension

Add one more resource or relationship, such as categories, projects, or tags,
and connect it to the database.  

I added in categories and connected it to the database. I added a new table "categories" to the database and connected it to the "items" table with the foreign key "category_id". There are two categories: 1 Tech Supplies and 2 Office Supplies. Now, when adding or replacing an item, you can include a category ID and the display will include the category ID and category name for each item.

## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

The data is now persistent. When you make changes to the "items" table, those changes stay in the database. You can exit the server and restart it and those changes will still be there. This is more like how real-world applications work, as any changes made should stay until another change cancels it out.

### 2. When should you use `PUT` instead of `PATCH`?

PUT completely replaces each field of the item, while PATCH can only replace one aspect of the item. If the user only wants to update the quantity of the item, for example, they should use PATCH so they do not have to re-type all the fields that they do not want to change in. PUT is useful if you do want to change every field. Trying to replace an item using PATCH could be frustrating (depending on the implementation). If the implementation of PATCH only includes logic to update one aspect at a time, the user would have to submit multiple PATCH requests to fully update the item. This could take much longer, depending on how many fields there are to update.

### 3. What kinds of validation belong in the API even if the browser client also validates input?

It is always good practice to include validation in the server, even if the client has field validation as well. If the client only validates that a field has to be filled out, an attacker could inject malicious SQL into that field and attack the system. The API is the last line of defense for the data, so we want to ensure that no malicious code or SQL attacks can persist. Additionally, if something incorrect were to get through the API, we want the user to experience error messages that we create. If an error message were to show up on the client that we did not write, it could expose critical information about the back end that attackers could use to infiltrate the system.

### 4. How does the browser client help you test the API differently than `curl` alone?

The browser client is much more user-friendly. Curl commands are long and hard to read, and they take more time when submitting multiple commands in a row. Editing the command within the terminal is not easy, and I had to return to a list of curl commands and copy and paste them. The browser client is extremely simple and consists of only labels, buttons, and text fields, but it makes testing commands much quicker. It is very easy to see which command you are running. Additionally, our browser client automatically reloads the item list after a change has made, which allows the user to check that the command worked without submitting a second GET curl command.

### 5. If you added an extension, what did you add and why?

I added in categories and connected it to the database. I added a new table "categories" to the database and connected it to the "items" table with the foreign key "category_id". There are two categories: 1 Tech Supplies and 2 Office Supplies. Now, when adding or replacing an item, you can include a category ID and the display will include the category ID and category name for each item. I wanted to explore how connecting two database tables would work, and experimented using the SQL JOIN command to display both the category ID from the "items" table as well as the category name from the "categories" table.
