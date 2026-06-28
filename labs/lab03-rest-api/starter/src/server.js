import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  // Starter data. This data is stored in memory and will reset when the
  // server restarts.
  let nextId = 3;
  const items = [
    { id: 1, name: "keyboard", quantity: 10 },
    { id: 2, name: "mouse", quantity: 5 }
  ];

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/items", (req, res) => {
    res.json(items);
  });

  app.get("/items/:id", (req, res) => {
    const requestedID = Number(req.params.id);
    const requestedItem = items.find(item => item.id === requestedID);
    if (requestedItem) {
      res.json(requestedItem);
    }
    else {
      res.status(404).json({ error: "Item not found."})
    }
  });

  app.post("/items", (req, res) => {
    const itemName = req.body.name;
    const itemQuantity = Number(req.body.quantity);
    if ( (itemName.trim().length > 0) && (!isNaN(itemQuantity) && itemQuantity > 0) ) {
      const newItem = { id: nextId, name: itemName, quantity: itemQuantity };
      items.push(newItem);
      nextId = nextId + 1;
      res.status(201).json(newItem);
    }
    else {
      res.status(400).json({ error: "Invalid or missing data." });
    }
  });

  app.put("/items/:id", (req, res) => {
    const requestedID = Number(req.params.id);
    const requestedItem = items.find(item => item.id == requestedID);
    if (requestedItem) {
      const itemName = req.body.name;
      const itemQuantity = Number(req.body.quantity);
      if ( (itemName.trim().length > 0) && (!isNaN(itemQuantity) && itemQuantity > 0) ) {
        requestedItem.name = itemName;
        requestedItem.quantity = itemQuantity;
        res.json(requestedItem);
      }
      else {
        res.status(400).json({ error: "Invalid or missing data." });
      }
    }
    else {
      res.status(404).json({ error: "Item not found."})
    }
  });

  app.delete("/items/:id", (req, res) => {
    const requestedID = Number(req.params.id);
    const requestedItem = items.find(item => item.id == requestedID);
    if (requestedItem) {
      const index = items.indexOf(requestedItem);
      if (index > -1) {
        items.splice(index, 1);
      }
      res.status(204).json({});
    }
    else {
      res.status(404).json({ error: "Item not found."})
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

// if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Lab 3 REST API listening on port ${PORT}`);
  });
// }
