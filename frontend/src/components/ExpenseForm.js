import React from "react";
import {
  fetchSubcategories,
  addSubcategory,
} from "../services/subcategoryService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { NumericFormat } from "react-number-format";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import esLocale from "date-fns/locale/es";
import styles from "./ExpenseForm.module.css";
import PAYMENT_METHODS from "../constants/paymentMethods";
import USERS from "../constants/users";
import { fetchCategories } from "../services/categoriesServices";
import Box from "@mui/material/Box";

// Parsear fecha YYYY-MM-DD o ISO como local
function parseLocalDate(dateString) {
  if (!dateString) return null;
  if (
    typeof dateString === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    const [year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  // Si es ISO o Date, que lo resuelva el constructor
  return new Date(dateString);
}

const ExpenseForm = ({ onSubmit, onCancel, editingExpense }) => {
  // Función auxiliar para verificar campos vacíos, nulos o sin seleccionar
  function isEmpty(val) {
    return (
      val === undefined ||
      val === null ||
      (typeof val === "string" && val.trim() === "")
    );
  }
  // Validación de campos obligatorios
  function isFormValid() {
    const hasCategory = !isEmpty(form.category);
    const hasSubcategory =
      (!isEmpty(form.subcategory) && form.subcategory !== "Nueva") ||
      (!isEmpty(form.newSubcategory) && form.subcategory === "Nueva");
    const hasPaymentMethod = !isEmpty(form.paymentMethod);
    const hasPaidBy = !isEmpty(form.paidBy);
    const amountValid =
      !isEmpty(form.amount) &&
      !isNaN(Number(form.amount)) &&
      Number(form.amount) > 0;
    const hasDate = !!form.date;

    return [
      hasCategory,
      hasSubcategory,
      hasPaymentMethod,
      hasPaidBy,
      amountValid,
      hasDate,
    ].every(Boolean);
  }
  // Estado para categorías dinámicas
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(Array.isArray(data) ? data : []);
    });
  }, []);

  const [form, setForm] = React.useState({
    category: editingExpense?.category || "",
    subcategory:
      editingExpense?.subcategory?._id || editingExpense?.subcategory || "",
    place: editingExpense?.place || "",
    paymentMethod: editingExpense?.paymentMethod || "",
    paidBy: editingExpense?.paidBy || "",
    amount: editingExpense?.amount || "",
    date: editingExpense?.date ? parseLocalDate(editingExpense.date) : null,
    newSubcategory: "",
  });

  const [subcategories, setSubcategories] = React.useState([]);
  const [loadingSubcats, setLoadingSubcats] = React.useState(true);
  const [addingSubcat, setAddingSubcat] = React.useState(false);

  React.useEffect(() => {
    setForm({
      category: editingExpense?.category || "",
      subcategory:
        editingExpense?.subcategory?._id || editingExpense?.subcategory || "",
      place: editingExpense?.place || "",
      paymentMethod: editingExpense?.paymentMethod || "",
      paidBy: editingExpense?.paidBy || "",
      amount: editingExpense?.amount || "",
      date: editingExpense?.date ? parseLocalDate(editingExpense.date) : null,
      newSubcategory: "",
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
        category: form.category,
      });
      if (result && result.subcategory) {
        setSubcategories((prev) => [...prev, result.subcategory]);
        setForm((prev) => ({
          ...prev,
          subcategory: result.subcategory._id,
          newSubcategory: "",
        }));
      } else if (result && result._id) {
        setSubcategories((prev) => [...prev, result]);
        setForm((prev) => ({
          ...prev,
          subcategory: result._id,
          newSubcategory: "",
        }));
      }
    } finally {
      setAddingSubcat(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Si hay subcategoría nueva, primero la agrega y luego envía el gasto
    if (form.newSubcategory.trim() && form.category) {
      handleAddSubcategory().then(() => {
        // El _id ya queda en form.subcategory
        onSubmit({ ...form, newSubcategory: undefined });
      });
    } else {
      // Buscar el _id de la subcategoría por nombre
      let subcategoryId = form.subcategory;
      const foundSubcat = subcategories.find(
        (s) => s.name === form.subcategory && s.category === form.category
      );
      if (foundSubcat) {
        subcategoryId = foundSubcat._id;
      }
      const expenseToSend = {
        ...form,
        subcategory: subcategoryId,
        newSubcategory: undefined, // no enviar este campo
      };
      onSubmit(expenseToSend);
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
          MenuProps={{
            PaperProps: {
              style: {
                maxWidth: 160,
              },
            },
          }}
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
          MenuProps={{
            PaperProps: {
              style: {
                maxWidth: 160,
              },
            },
          }}
        >
          <MenuItem value="">Subcategoría</MenuItem>
          {subcategories
            .filter((s) => s.category === form.category)
            .sort((a, b) =>
              a.name.localeCompare(b.name, "es", { sensitivity: "base" })
            )
            .map((s) => (
              <MenuItem key={s._id} value={s.name}>
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
            disabled={
              !form.category || !form.newSubcategory.trim() || addingSubcat
            }
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
          MenuProps={{
            PaperProps: {
              style: {
                maxWidth: 160,
              },
            },
          }}
        >
          <MenuItem value="">Medio de Pago</MenuItem>
          {[...PAYMENT_METHODS.map((m) => m.value)]
            .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
            .map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
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
          MenuProps={{
            PaperProps: {
              style: {
                maxWidth: 160,
              },
            },
          }}
        >
          <MenuItem value="">Pagado por</MenuItem>
          {USERS.map((user) => (
            <MenuItem key={user.value} value={user.value}>
              {user.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <NumericFormat
        customInput={TextField}
        name="amount"
        label="Monto"
        value={form.amount}
        onValueChange={(values) => {
          setForm((prev) => ({ ...prev, amount: values.value }));
        }}
        thousandSeparator="."
        decimalSeparator=","
        allowNegative={false}
        fullWidth
        size="small"
        required
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
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={!isFormValid()}
        >
          {editingExpense ? "Actualizar" : "Agregar"}
        </Button>
      </Box>
    </Box>
  );
};

export default ExpenseForm;
