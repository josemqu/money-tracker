import React from 'react';
import { TextField, MenuItem, Box, IconButton, Tooltip } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

export default function ExpenseFilters({ filters, setFilters }) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
      <TextField
        select
        label="Categoría"
        name="category"
        value={filters.category || ''}
        onChange={handleFilterChange}
        variant="outlined"
        size="small"
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">Todas</MenuItem>
        <MenuItem value="Casa">Casa</MenuItem>
        <MenuItem value="Comida">Comida</MenuItem>
        <MenuItem value="Cuidado personal">Cuidado personal</MenuItem>
        <MenuItem value="Indumentaria">Indumentaria</MenuItem>
        <MenuItem value="Regalos">Regalos</MenuItem>
        <MenuItem value="Salud">Salud</MenuItem>
        <MenuItem value="Salida">Salida</MenuItem>
        <MenuItem value="Transporte">Transporte</MenuItem>
      </TextField>

      <TextField
        select
        label="Subcategoría"
        name="subcategory"
        value={filters.subcategory || ''}
        onChange={handleFilterChange}
        variant="outlined"
        size="small"
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">Todas</MenuItem>
        <MenuItem value="Almuerzo">Almuerzo</MenuItem>
        <MenuItem value="Bazar">Bazar</MenuItem>
        <MenuItem value="Bar">Bar</MenuItem>
        <MenuItem value="Brunch">Brunch</MenuItem>
        <MenuItem value="Calzado">Calzado</MenuItem>
        <MenuItem value="Carniceria">Carniceria</MenuItem>
        <MenuItem value="Café">Café</MenuItem>
        <MenuItem value="Consulta">Consulta</MenuItem>
        <MenuItem value="Cumpleaños">Cumpleaños</MenuItem>
        <MenuItem value="Delivery">Delivery</MenuItem>
        <MenuItem value="Dietética">Dietética</MenuItem>
        <MenuItem value="Entretenimiento">Entretenimiento</MenuItem>
        <MenuItem value="Expensas">Expensas</MenuItem>
        <MenuItem value="Farmacia">Farmacia</MenuItem>
        <MenuItem value="Ferretería">Ferretería</MenuItem>
        <MenuItem value="Gas">Gas</MenuItem>
        <MenuItem value="Granja">Granja</MenuItem>
        <MenuItem value="Heladeria">Heladeria</MenuItem>
        <MenuItem value="Internet">Internet</MenuItem>
        <MenuItem value="Kiosco">Kiosco</MenuItem>
        <MenuItem value="Libreria">Libreria</MenuItem>
        <MenuItem value="Limpieza">Limpieza</MenuItem>
        <MenuItem value="Luz">Luz</MenuItem>
        <MenuItem value="Masajes">Masajes</MenuItem>
        <MenuItem value="Marta">Marta</MenuItem>
        <MenuItem value="Merienda">Merienda</MenuItem>
        <MenuItem value="Nafta">Nafta</MenuItem>
        <MenuItem value="Otros">Otros</MenuItem>
        <MenuItem value="Panadería">Panadería</MenuItem>
        <MenuItem value="Peluquería">Peluquería</MenuItem>
        <MenuItem value="Prepaga">Prepaga</MenuItem>
        <MenuItem value="Propina">Propina</MenuItem>
        <MenuItem value="Restaurante">Restaurante</MenuItem>
        <MenuItem value="Salida">Salida</MenuItem>
        <MenuItem value="Supermercado">Supermercado</MenuItem>
        <MenuItem value="Verdulería">Verdulería</MenuItem>
      </TextField>

      <TextField
        label="Buscar Local"
        name="local"
        value={filters.local || ''}
        onChange={handleFilterChange}
        variant="outlined"
        size="small"
        sx={{ minWidth: 120 }}
      />
      <Tooltip title="Limpiar filtros">
        <IconButton
          aria-label="limpiar filtros"
          onClick={() => setFilters({ category: '', local: '', subcategory: '' })}
          sx={{ ml: 1, color: '#bbb' }}
        >
          <DeleteSweepIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
