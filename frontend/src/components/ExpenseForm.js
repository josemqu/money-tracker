import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import esLocale from 'date-fns/locale/es';

const ExpenseForm = ({ onSubmit, onCancel, editingExpense, dateValue, setDateValue }) => {
  const categories = [
    'Transporte',
    'Salida',
    'Salud',
    'Comida',
    'Casa',
    'Regalos',
    'Indumetaria',
    'Cuidado Personal'
  ];

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="category-label">Categoría</InputLabel>
        <Select
          labelId="category-label"
          name="category"
          required
          defaultValue={editingExpense?.category || ''}
          label="Categoría"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="subcategory-label">Subcategoría</InputLabel>
        <Select
          labelId="subcategory-label"
          name="subcategory"
          required
          defaultValue={editingExpense?.subcategory || ''}
          label="Subcategoría"
        >
          <MenuItem value="">Subcategoría</MenuItem>
          <MenuItem value="Nafta">Nafta</MenuItem>
          <MenuItem value="Brunch">Brunch</MenuItem>
          <MenuItem value="Consulta">Consulta</MenuItem>
          <MenuItem value="Supermercado">Supermercado</MenuItem>
          <MenuItem value="Gas">Gas</MenuItem>
          <MenuItem value="Verdulería">Verdulería</MenuItem>
          <MenuItem value="Luz">Luz</MenuItem>
          <MenuItem value="Farmacia">Farmacia</MenuItem>
          <MenuItem value="Entretenimiento">Entretenimiento</MenuItem>
          <MenuItem value="Limpieza">Limpieza</MenuItem>
          <MenuItem value="Expensas">Expensas</MenuItem>
          <MenuItem value="Cumpleaños">Cumpleaños</MenuItem>
          <MenuItem value="Calzado">Calzado</MenuItem>
          <MenuItem value="Café">Café</MenuItem>
          <MenuItem value="Propina">Propina</MenuItem>
          <MenuItem value="Marta">Marta</MenuItem>
          <MenuItem value="Ferretería">Ferretería</MenuItem>
          <MenuItem value="Prepaga">Prepaga</MenuItem>
          <MenuItem value="Panadería">Panadería</MenuItem>
          <MenuItem value="Bazar">Bazar</MenuItem>
          <MenuItem value="Carniceria">Carniceria</MenuItem>
          <MenuItem value="Heladeria">Heladeria</MenuItem>
          <MenuItem value="Dietetica">Dietetica</MenuItem>
          <MenuItem value="Merienda">Merienda</MenuItem>
          <MenuItem value="Internet">Internet</MenuItem>
          <MenuItem value="Cena">Cena</MenuItem>
          <MenuItem value="Libreria">Libreria</MenuItem>
          <MenuItem value="Peluquería">Peluquería</MenuItem>
          <MenuItem value="Salida">Salida</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="local"
        label="Local"
        defaultValue={editingExpense?.local || ''}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel id="paymentMethod-label">Medio de Pago</InputLabel>
        <Select
          labelId="paymentMethod-label"
          name="paymentMethod"
          required
          defaultValue={editingExpense?.paymentMethod || ''}
          label="Medio de Pago"
        >
          <MenuItem value="">Medio de Pago</MenuItem>
          <MenuItem value="Crédito">Crédito</MenuItem>
          <MenuItem value="Contado">Contado</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="paidBy-label">Pagado por</InputLabel>
        <Select
          labelId="paidBy-label"
          name="paidBy"
          required
          defaultValue={editingExpense?.paidBy || ''}
          label="Pagado por"
        >
          <MenuItem value="">Pagado por</MenuItem>
          <MenuItem value="José">José</MenuItem>
          <MenuItem value="Maru">Maru</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="amount"
        label="Monto"
        type="number"
        inputProps={{ step: '0.01' }}
        defaultValue={editingExpense?.amount || ''}
        required
        fullWidth
      />

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
        <DatePicker
          label="Fecha"
          value={dateValue}
          onChange={(newValue) => setDateValue(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          {editingExpense ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );
};

export default ExpenseForm;
