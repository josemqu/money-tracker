export const CATS_URL =
  process.env.REACT_APP_CATS_URL ||
  "https://money-tracker-8k24.onrender.com/api/categories";

export const SUBCATS_URL =
  process.env.REACT_APP_SUBCATS_URL ||
  "https://money-tracker-8k24.onrender.com/api/subcategories";

export async function fetchCategories() {
  const response = await fetch(CATS_URL);
  return response.json();
}

export async function fetchSubcategories() {
  const response = await fetch(SUBCATS_URL);
  return response.json();
}

export async function addCategory(data) {
  const response = await fetch(CATS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateCategory(id, data) {
  const response = await fetch(`${CATS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteCategory(id) {
  const response = await fetch(`${CATS_URL}/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function clearAllCategories() {
  const response = await fetch(`${CATS_URL}`, {
    method: "DELETE",
  });
  return response.json();
}
