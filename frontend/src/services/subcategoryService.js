const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/expenses$/, '/subcategories')
  : 'http://localhost:5002/subcategories';

export async function fetchSubcategories() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function addSubcategory(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
