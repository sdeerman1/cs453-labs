const API_BASE_URL = "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const itemList = document.querySelector("#items");
const form = document.querySelector("#add-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const itemCategoryInput = document.querySelector("#item-category");
const statusBox = document.querySelector("#status");

const updateForm = document.querySelector("#update-item-form");
const updateIdInput = document.querySelector("#update-id");
const updateItemNameInput = document.querySelector("#update-item-name");
const updateItemQuantityInput = document.querySelector("#update-item-quantity");
const updateItemCategoryInput = document.querySelector("#update-item-category");
const deleteForm = document.querySelector("#delete-item-form");
const deleteIDInput = document.querySelector("#delete-id");

function setStatus(message) {
  statusBox.textContent = message;
}

function renderItems(items) {
  itemList.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = `${item.id}: ${item.name} (${item.quantity}) (Category ${item.category_id}: ${item.category})`;
    itemList.appendChild(li);
  }
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);

    if (!response.ok) {
      throw new Error(`GET /api/items failed with status ${response.status}`);
    }

    const data = await response.json();
    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function loadItemByID(id) {
  setStatus("Loading item ...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`);

    if (!response.ok) {
      throw new Error(`GET /api/items/:id failed with status ${response.status}`);
    }

    const data = await response.json();
    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function addItem(name, quantity, category) {
  setStatus("Adding item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity, category })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/items failed with status ${response.status}`);
    }

    setStatus(`Added item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function replaceItem(id, name, quantity, category) {
  setStatus("Replacing item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity, category })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `PUT /api/items failed with status ${response.status}`);
    }

    setStatus(`Replaced item: ${id}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteItem(id) {
  setStatus("Deleting item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`DELETE /api/items/:id failed with status ${response.status}`);
    }

    await loadItems();
    setStatus("Item Deleted.");
  } catch (error) {
    setStatus(error.message);
  }
}

loadButton.addEventListener("click", loadItems);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);
  const category = Number(itemCategoryInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(category) || category < 0) {
    setStatus("Enter a name and a non-negative integer quantity and category.");
    return;
  }

  itemNameInput.value = "";
  itemQuantityInput.value = "0";
  itemCategoryInput.value = "0";
  await addItem(name, quantity, category);
});

deleteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const deleteID = Number(deleteIDInput.value);

  if (!Number.isInteger(deleteID) || deleteID < 0) {
    setStatus("Enter a non-negative integer ID.");
    return;
  }

  deleteIDInput.value = "0";
  await deleteItem(deleteID);
});

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const updateId = Number(updateIdInput.value);
  const updateName = updateItemNameInput.value.trim();
  const updateQuantity = Number(updateItemQuantityInput.value);
  const updateCategory = Number(updateItemCategoryInput.value);

  if (!Number.isInteger(updateId) || updateId < 0) {
    setStatus("Enter a non-negative integer ID.");
    return;
  }

  if (!updateName || !Number.isInteger(updateQuantity) || updateQuantity < 0 || !Number.isInteger(updateCategory) || updateCategory < 0) {
    setStatus("Enter a name and a non-negative integer quantity and category.");
    return;
  }

  updateIdInput.value = "0";
  updateItemNameInput.value = "";
  updateItemQuantityInput.value = "0";
  updateItemCategoryInput.value = "0";
  await replaceItem(updateId, updateName, updateQuantity, updateCategory);
});
