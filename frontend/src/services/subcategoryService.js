export const SUBCATS_URL =
  process.env.REACT_APP_SUBCATS_URL ||
  "https://money-tracker-8k24.onrender.com/api/subcategories";

export async function fetchSubcategories() {
  const response = await fetch(SUBCATS_URL);
  return response.json();
}

export async function addSubcategory(data) {
  const response = await fetch(SUBCATS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
