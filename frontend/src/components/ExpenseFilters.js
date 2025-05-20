import React from "react";
import { TextField, MenuItem, Box, IconButton, Tooltip } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

export default function ExpenseFilters({ filters, setFilters }) {
  const [categories, setCategories] = React.useState([]);
  const [subcategories, setSubcategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/subcategories').then(res => res.json())
    ]).then(([cats, subs]) => {
      console.log('Categorías recibidas:', cats);
      console.log('Subcategorías recibidas:', subs);
      if (!Array.isArray(cats) || cats.length === 0) {
        console.warn('No se recibieron categorías desde la API');
      }
      if (!Array.isArray(subs) || subs.length === 0) {
        console.warn('No se recibieron subcategorías desde la API');
      }
      setCategories(Array.isArray(cats) ? cats : []);
      setSubcategories(Array.isArray(subs) ? subs : []);
      setLoading(false);
    }).catch((err) => {
      console.error('Error al cargar categorías o subcategorías:', err);
      setLoading(false);
    });
  }, []);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
      <TextField
        select
        label="Categoría"
        name="category"
        value={filters.category || ""}
        onChange={handleFilterChange}
        variant="outlined"
        size="small"
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">Todas</MenuItem>
        {categories
          .map(cat => (typeof cat === 'string' ? cat : cat.name))
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
          .map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
      </TextField>

      <TextField
        select
        label="Subcategoría"
        name="subcategory"
        value={filters.subcategory || ""}
        onChange={handleFilterChange}
        variant="outlined"
        size="small"
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">Todas</MenuItem>
        {subcategories
          .filter(sub => !filters.category || sub.category === filters.category)
          .map(sub => (typeof sub === 'string' ? sub : sub.name))
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
          .map((subcat) => (
            <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
          ))}
      </TextField>

      <TextField
        label="Lugar"
        name="place"
        value={filters.place || ""}
        onChange={handleFilterChange}
        variant="outlined"
        size="small"
        sx={{ minWidth: 120 }}
      />
      <Tooltip title="Limpiar filtros">
        <IconButton
          aria-label="limpiar filtros"
          onClick={() =>
            setFilters({ category: "", place: "", subcategory: "" })
          }
          sx={{ ml: 1, color: "#bbb" }}
        >
          <DeleteSweepIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
