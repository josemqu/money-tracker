import React from "react";
import { fetchSubcategories, addSubcategory } from "../services/subcategoryService";
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
    date: editingExpense?.date ? parseLocalDate(editingExpense.date) : null,
    newSubcategory: ""
  });

  const [subcategories, setSubcategories] = React.useState([]);
  const [loadingSubcats, setLoadingSubcats] = React.useState(true);
  const [addingSubcat, setAddingSubcat] = React.useState(false);

  React.useEffect(() => {
    setForm({
      category: editingExpense?.category || "",
      subcategory: editingExpense?.subcategory || "",
      place: editingExpense?.place || "",
      paymentMethod: editingExpense?.paymentMethod || "",
      paidBy: editingExpense?.paidBy || "",
      amount: editingExpense?.amount || "",
      date: editingExpense?.date ? parseLocalDate(editingExpense.date) : null,
      newSubcategory: ""
    });
  }, [editingExpense]);

  React.useEffect(() => {
    setLoadingSubcats(true);
    fetchSubcategories().then((data) => {
      setSubcategories(Array.isArray(data) ? data : []);
      setLoadingSubcats(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewSubcatChange = (e) => {
    setForm((prev) => ({ ...prev, newSubcategory: e.target.value }));
  };

  const handleAddSubcategory = async () => {
    if (!form.newSubcategory.trim() || !form.category) return;
    setAddingSubcat(true);
    try {
      const result = await addSubcategory({
        name: form.newSubcategory.trim(),
        category: form.category
      });
      if (result && result.subcategory) {
        setSubcategories((prev) => [...prev, result.subcategory]);
        setForm((prev) => ({ ...prev, subcategory: result.subcategory.name, newSubcategory: "" }));
      } else if (result && result.name) {
        setSubcategories((prev) => [...prev, result]);
        setForm((prev) => ({ ...prev, subcategory: result.name, newSubcategory: "" }));
      }
    } finally {
      setAddingSubcat(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newSubcategory.trim() && form.category) {
      // Si hay subcategoría nueva, primero la agrega y luego envía el gasto
      handleAddSubcategory().then(() => {
        onSubmit({ ...form, subcategory: form.newSubcategory.trim(), newSubcategory: undefined });
      });
    } else {
      onSubmit(form);
    }
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
          disabled={loadingSubcats || !form.category}
        >
          <MenuItem value="">Subcategoría</MenuItem>
          {subcategories
            .filter((s) => s.category === form.category)
            .map((s) => (
              <MenuItem key={s._id || s.name} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
          <MenuItem value="Nueva">Nueva</MenuItem>
        </Select>
      </FormControl>
      {form.subcategory === "Nueva" && (
        <Box display="flex" alignItems="center" gap={1} mt={1} mb={2}>
          <TextField
            label="Nueva subcategoría"
            value={form.newSubcategory}
            onChange={handleNewSubcatChange}
            size="small"
            disabled={!form.category || addingSubcat}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddSubcategory}
            disabled={!form.category || !form.newSubcategory.trim() || addingSubcat}
          >
            Agregar
          </Button>
        </Box>
      )}

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
