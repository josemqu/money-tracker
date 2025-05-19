import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import esLocale from "date-fns/locale/es";
import styles from "./ExpenseForm.module.css";

// Parsear fecha YYYY-MM-DD como local
function parseLocalDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

const ExpenseForm = ({
  onSubmit,
  onCancel,
  editingExpense,
}) => {
  const categories = [
    "Transporte",
    "Salida",
    "Salud",
    "Comida",
    "Casa",
    "Regalos",
    "Indumentaria",
    "Cuidado Personal",
  ];

  const [form, setForm] = React.useState({
    category: editingExpense?.category || "",
    subcategory: editingExpense?.subcategory || "",
    place: editingExpense?.place || "",
    paymentMethod: editingExpense?.paymentMethod || "",
    paidBy: editingExpense?.paidBy || "",
    amount: editingExpense?.amount || "",
    date: editingExpense?.date ? parseLocalDate(editingExpense.date) : null
  });

  React.useEffect(() => {
    setForm({
      category: editingExpense?.category || "",
      subcategory: editingExpense?.subcategory || "",
      place: editingExpense?.place || "",
      paymentMethod: editingExpense?.paymentMethod || "",
      paidBy: editingExpense?.paidBy || "",
      amount: editingExpense?.amount || "",
      date: editingExpense?.date ? parseLocalDate(editingExpense.date) : null
    });
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleDateChange = (newValue) => {
    setForm((prev) => ({ ...prev, date: newValue }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className={styles.formRoot}>
      <FormControl fullWidth size="small">
        <InputLabel id="category-label">Categoría</InputLabel>
        <Select
          labelId="category-label"
          name="category"
          required
          value={form.category}
          onChange={handleChange}
          label="Categoría"
          size="small"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel id="subcategory-label">Subcategoría</InputLabel>
        <Select
          labelId="subcategory-label"
          name="subcategory"
          required
          value={form.subcategory}
          onChange={handleChange}
          label="Subcategoría"
          size="small"
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
        name="place"
        label="Lugar"
        value={form.place}
        onChange={handleChange}
        fullWidth
        size="small"
        InputProps={{ className: styles.inputDark }}
      />

      <FormControl fullWidth size="small">
        <InputLabel id="paymentMethod-label">Medio de Pago</InputLabel>
        <Select
          labelId="paymentMethod-label"
          name="paymentMethod"
          required
          value={form.paymentMethod}
          onChange={handleChange}
          label="Medio de Pago"
          size="small"
        >
          <MenuItem value="">Medio de Pago</MenuItem>
          <MenuItem value="Crédito">Crédito</MenuItem>
          <MenuItem value="Contado">Contado</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel id="paidBy-label">Pagado por</InputLabel>
        <Select
          labelId="paidBy-label"
          name="paidBy"
          required
          value={form.paidBy}
          onChange={handleChange}
          label="Pagado por"
          size="small"
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
        inputProps={{ step: "0.01" }}
        value={form.amount}
        onChange={handleChange}
        required
        fullWidth
        size="small"
        InputProps={{ className: styles.inputDark }}
      />

      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={esLocale}
      >
        <DatePicker
          label="Fecha"
          value={form.date}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              InputProps: { className: styles.inputDark },
            },
          }}
        />
      </LocalizationProvider>

      <Box className={styles.buttonRow}>
        <Button variant="outlined" onClick={onCancel} size="small">
          Cancelar
        </Button>
        <Button type="submit" variant="contained" size="small">
          {editingExpense ? "Actualizar" : "Agregar"}
        </Button>
      </Box>
    </Box>
  );
};

export default ExpenseForm;
