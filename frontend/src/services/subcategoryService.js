let base = process.env.REACT_APP_API_URL || '';
let SUBCATS_URL = '';
if (base) {
  SUBCATS_URL = base.replace(/\/expenses$/, '/subcategories');
} else if (window.location.hostname === 'localhost') {
  SUBCATS_URL = 'http://localhost:5002/subcategories';
} else {
  SUBCATS_URL = '/subcategories';
}

export async function fetchSubcategories() {
  const response = await fetch(SUBCATS_URL);
  return response.json();
}

export async function addSubcategory(data) {
  const response = await fetch(SUBCATS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
