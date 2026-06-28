import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

describe("Lab 3 starter", () => {
  test("GET /health returns status ok", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/health")
        .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /items returns a list of items", async () => {
    const app = createApp();
    const result = await request(app).get("/items");

    expect(result.body).toBeInstanceOf(Array);
  });

  test("POST /items creates a new item", async () => {
    const app = createApp();
    const result = await request(app)
      .post("/items")
      .send({
        "name": "monitor",
        "quantity": 4
      })
      .expect('Content-Type', /json/)
      .expect(201);

    expect(result.body).toEqual({
      "id": 3,
      "name": "monitor",
      "quantity": 4
    });
  });

  test("GET /items/:id can retrieve an item", async () => {
    const app = createApp();
    const result = await request(app).get("/items/1");

    expect(result.body).toEqual({
      "id": 1,
      "name": "keyboard",
      "quantity": 10
    });
  });

  test("PUT /items/:id updates an item", async () => {
    const app = createApp();
    const result = await request(app)
      .put("/items/1")
      .send({
        "name": "mechanical keyboard",
        "quantity": 12
      })
      .expect('Content-Type', /json/);

    expect(result.body).toEqual({
      "id": 1,
      "name": "mechanical keyboard",
      "quantity": 12
    });
  });

  test("DELETE /items/:id deletes an item", async () => {
    const app = createApp();
    const result = await request(app).delete("/items/1");

    expect(result.status).toEqual(204);
  });

  test("a missing item returns 404, GET", async () => {
    const app = createApp();
    const result = await request(app).get("/items/10");

    expect(result.status).toEqual(404);
    expect(result.body).toHaveProperty("error");
  });

  test("a missing item returns 404, PUT", async () => {
    const app = createApp();
    const result = await request(app)
      .put("/items/10")
      .send({
        "name": "monitor",
        "quantity": 4
      })
      .expect('Content-Type', /json/)
      .expect(404);

    expect(result.body).toHaveProperty("error");
  });

  test("a missing item returns 404, DELETE", async () => {
    const app = createApp();
    const result = await request(app).delete("/items/10");

    expect(result.status).toEqual(404);
    expect(result.body).toHaveProperty("error");
  });

  test("error handling for name being nonempty string, POST", async () => {
    const app = createApp();
    const result = await request(app)
      .post("/items")
      .send({
        "name": "",
        "quantity": 12
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(result.body).toHaveProperty("error");
  });

  test("error handling for name being nonempty string, PUT", async () => {
    const app = createApp();
    const result = await request(app)
      .put("/items/1")
      .send({
        "name": "",
        "quantity": 12
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(result.body).toHaveProperty("error");
  });

  test("error handling for quantity being less than zero, POST", async () => {
    const app = createApp();
    const result = await request(app)
      .post("/items")
      .send({
        "name": "mechanical keyboard",
        "quantity": -1
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(result.body).toHaveProperty("error");
  });

  test("error handling for quantity being less than zero, PUT", async () => {
    const app = createApp();
    const result = await request(app)
      .put("/items/1")
      .send({
        "name": "mechanical keyboard",
        "quantity": -1
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(result.body).toHaveProperty("error");
  });

});