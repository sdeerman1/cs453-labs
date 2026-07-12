import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5433),
  database: process.env.PGDATABASE ?? "lab05",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres"
});

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  }));

  app.get("/health", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection failed."
      });
    }
  });

  // Starter route: return every item from the database.
  app.get("/api/items", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT items.id, items.name, items.quantity, items.category_id, categories.name AS category
        FROM items
        JOIN categories ON items.category_id = categories.id
        ORDER BY id ASC
      `);

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  // Starter route: create one item so the client can demonstrate a write.
  app.post("/api/items", async (req, res) => {
    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);
    const category = Number(req.body?.category);

    if (!name || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(category) || category < 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity and category are required."
      });
    }

    try {
      const categoryResult = await pool.query(
        `SELECT id 
        FROM categories
        WHERE id = $1`,
        [category]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(400).json({
          error: "Invalid category ID"
        });
      }

      const result = await pool.query(
        `
          INSERT INTO items (name, quantity, category_id)
          VALUES ($1, $2, $3)
          RETURNING id, name, quantity, category_id
        `,
        [name, quantity, category]
      );

      res.status(201).json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to add item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add item."
      });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    const requestedID = Number(req.params.id);
    try {
      const result = await pool.query(`
        SELECT id, name, quantity, category_id
        FROM items
        WHERE id = $1`,
        [requestedID]
      );

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  app.put("/api/items/:id", async (req, res) => {
    const requestedID = Number(req.params.id);
    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);
    const category = Number(req.body?.category);

    if (!name || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(category) || category < 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity and category are required."
      });
    }

    try {
      const categoryResult = await pool.query(
        `SELECT id 
        FROM categories
        WHERE id = $1`,
        [category]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(400).json({
          error: "Invalid category ID"
        });
      }

      const result = await pool.query(`
        UPDATE items
        SET name = $1, quantity = $2, category_id = $3
        WHERE id = $4`,
        [name, quantity, category, requestedID]
      );

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    const requestedID = Number(req.params.id);
    if ("name" in req.body) {
      const name = req.body?.name?.trim();
      if (!name) {
        return res.status(400).json({
          error: "Bad Request",
          message: "A name is required."
        });
      }
      try {
        const result = await pool.query(`
          UPDATE items
          SET name = $1
          WHERE id = $2`,
          [name, requestedID]
        );

        res.json({ items: result.rows });
      } catch (error) {
        console.error("Failed to load items:", error);
        res.status(500).json({
          error: "Internal Server Error",
          message: "Failed to load items."
        });
      }
    }
    if ("quantity" in req.body) {
      const quantity = Number(req.body?.quantity);
      if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: "A non-negative integer quantity is required."
        });
      }
      try {
        const result = await pool.query(`
          UPDATE items
          SET quantity = $1
          WHERE id = $2`,
          [quantity, requestedID]
        );

        res.json({ items: result.rows });
      } catch (error) {
        console.error("Failed to load items:", error);
        res.status(500).json({
          error: "Internal Server Error",
          message: "Failed to load items."
        });
      }
    }
    if ("category" in req.body) {
      const category = Number(req.body?.category);
      if (!Number.isInteger(category) || category < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: "A non-negative integer category is required."
        });
      }
      try {
        const categoryResult = await pool.query(
          `SELECT id 
          FROM categories
          WHERE id = $1`,
          [category]
        );

        if (categoryResult.rows.length === 0) {
          return res.status(400).json({
            error: "Invalid category ID"
          });
        }

        const result = await pool.query(`
          UPDATE items
          SET category_id = $1
          WHERE id = $2`,
          [category, requestedID]
        );

        res.json({ items: result.rows });
      } catch (error) {
        console.error("Failed to load items:", error);
        res.status(500).json({
          error: "Internal Server Error",
          message: "Failed to load items."
        });
      }
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    const requestedID = Number(req.params.id);
    try {
      const result = await pool.query(`
        DELETE FROM items
        WHERE id = $1`,
        [requestedID]
      );

      res.status(204).json({ status: "Successfully deleted" });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);

  const result = await pool.query("SELECT COUNT(*)::int AS count FROM categories");

  if (result.rows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO categories (name)
        VALUES ($1), ($2)
      `,
      ["Tech Supplies", "Office Supplies"]
    );
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity >= 0),
      category_id INTEGER NOT NULL REFERENCES categories(id)
    )
  `);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");

  if (rows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO items (name, quantity, category_id)
        VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)
      `,
      ["Keyboard", 10, 1, "Mouse", 5, 1, "Monitor", 3, 1]
    );
  }
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

// if (isMainModule) {
  const app = createApp();

  // if database has already been initialized without my "category" column added,
  // uncomment the below code out to reset the tables.

  await pool.query(`
    DROP TABLE items;
    DROP TABLE categories;
    `)

  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Lab 5 API listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exit(1);
    });
// }
