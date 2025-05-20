// Script para poblar subcategorías en el backend remoto
// Ejecutar con: node scripts/add_subcategories.js

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const SUBCATS_URL = process.env.REMOTE_SUBCATS_URL || 'https://money-tracker-8k24.onrender.com/subcategories';

const subcategories = [
  { name: "Bazar", category: "Casa" },
  { name: "Entretenimiento", category: "Casa" },
  { name: "Expensas", category: "Casa" },
  { name: "Ferretería", category: "Casa" },
  { name: "Gas", category: "Casa" },
  { name: "Internet", category: "Casa" },
  { name: "Limpieza", category: "Casa" },
  { name: "Luz", category: "Casa" },
  { name: "Marta", category: "Casa" },
  { name: "Otros", category: "Casa" },
  { name: "Almuerzo", category: "Comida" },
  { name: "Café", category: "Comida" },
  { name: "Carniceria", category: "Comida" },
  { name: "Cena", category: "Comida" },
  { name: "Dietética", category: "Comida" },
  { name: "Fiambreria", category: "Comida" },
  { name: "Granja", category: "Comida" },
  { name: "Heladeria", category: "Comida" },
  { name: "Panadería", category: "Comida" },
  { name: "Salida", category: "Comida" },
  { name: "Supermercado", category: "Comida" },
  { name: "Verdulería", category: "Comida" },
  { name: "Farmacia", category: "Cuidado personal" },
  { name: "Masajes", category: "Cuidado personal" },
  { name: "Peluquería", category: "Cuidado personal" },
  { name: "Calzado", category: "Indumetaria" },
  { name: "Cumpleaños", category: "Regalos" },
  { name: "Dietética", category: "Regalos" },
  { name: "Libreria", category: "Regalos" },
  { name: "Almuerzo", category: "Salida" },
  { name: "Brunch", category: "Salida" },
  { name: "Café", category: "Salida" },
  { name: "Cena", category: "Salida" },
  { name: "Merienda", category: "Salida" },
  { name: "Panadería", category: "Salida" },
  { name: "Propina", category: "Salida" },
  { name: "Consulta", category: "Salud" },
  { name: "Farmacia", category: "Salud" },
  { name: "Prepaga", category: "Salud" },
  { name: "Nafta", category: "Transporte" },
];

(async () => {
  for (const subcat of subcategories) {
    try {
      const res = await fetch(SUBCATS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subcat)
      });
      if (!res.ok) {
        console.error(`Error agregando ${subcat.name} (${subcat.category}):`, await res.text());
      } else {
        console.log(`Agregada: ${subcat.name} (${subcat.category})`);
      }
    } catch (e) {
      console.error(`Error agregando ${subcat.name} (${subcat.category}):`, e.message);
    }
  }
})();
