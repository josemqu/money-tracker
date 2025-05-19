export const API_URL = process.env.REACT_APP_API_URL || "https://money-tracker-8k24.onrender.com/expenses";

export async function fetchExpenses() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function addExpense(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateExpense(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function clearAllExpenses() {
  const response = await fetch(`${API_URL}`, {
    method: "DELETE",
  });
  return response.json();
}
