import React from "react";
import {
  TextField,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import styles from "./ExpenseFilters.module.css";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

export default function ExpenseFilters({ filters, setFilters }) {
  const [categories, setCategories] = React.useState([]);
  const [subcategories, setSubcategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  // Importar los servicios
  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      require("../services/categoriesServices").fetchCategories(),
      require("../services/categoriesServices").fetchSubcategories(),
    ])
      .then(([cats, subs]) => {
        if (!Array.isArray(cats) || cats.length === 0) {
          console.warn("No se recibieron categorías desde la API");
        }
        if (!Array.isArray(subs) || subs.length === 0) {
          console.warn("No se recibieron subcategorías desde la API");
        }
        setCategories(Array.isArray(cats) ? cats : []);
        setSubcategories(Array.isArray(subs) ? subs : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar categorías o subcategorías:", err);
        setLoading(false);
      });
  }, []);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box className={styles.filtersContainer}>
      <FormControl fullWidth size="small" className={styles.filterField}>
        <InputLabel id="category-filter-label">Categoría</InputLabel>
        <Select
          labelId="category-filter-label"
          id="category-filter"
          name="category"
          value={filters.category || ""}
          label="Categoría"
          onChange={handleFilterChange}
          className={styles.filterField}
          MenuProps={{
            PaperProps: {
              style: {
                maxWidth: 160,
              },
            },
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          {categories
            .map((cat) => (typeof cat === "string" ? cat : cat.name))
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
            .map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small" className={styles.filterField}>
        <InputLabel id="subcategory-filter-label">Subcategoría</InputLabel>
        <Select
          labelId="subcategory-filter-label"
          id="subcategory-filter"
          name="subcategory"
          value={filters.subcategory || ""}
          label="Subcategoría"
          onChange={handleFilterChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxWidth: 160,
              },
            },
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          {(() => {
            const filteredSubs = subcategories
              .filter(
                (s) => !filters.category || s.category === filters.category
              )
              .map((sub) => (typeof sub === "string" ? { name: sub } : sub))
              .filter((s) => s.name);
            const uniqueSubs = filteredSubs.filter(
              (sub, idx, arr) =>
                arr.findIndex((s) => s.name === sub.name) === idx
            );
            return uniqueSubs
              .sort((a, b) =>
                a.name.localeCompare(b.name, "es", { sensitivity: "base" })
              )
              .map((s) => (
                <MenuItem key={s.name} value={s.name}>
                  {s.name}
                </MenuItem>
              ));
          })()}
        </Select>
      </FormControl>
      <TextField
        label="Lugar"
        name="place"
        value={filters.place || ""}
        onChange={handleFilterChange}
        variant="outlined"
        size="small"
        className={styles.filterField}
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
