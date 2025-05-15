import React from "react";
import "./App.css";
import CATEGORY_COLORS from "./categoryColors";
import Chip from "@mui/material/Chip";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import esLocale from 'date-fns/locale/es';
import ChartsSection from './ChartsSection';
import ExpenseFilters from './components/ExpenseFilters';
import { Tabs, Tab, Box } from '@mui/material';
import {
  FaPlus,
  FaWallet,
  FaHome,
  FaCar,
  FaUtensils,
  FaHeartbeat,
  FaGift,
  FaTshirt,
  FaUserFriends,
  FaRegStar,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";

function App() {
  const [expenses, setExpenses] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [filters, setFilters] = React.useState({ category: '', local: '' });
  const [editingExpense, setEditingExpense] = React.useState(null); // null = alta, objeto = edición
  const [dateValue, setDateValue] = React.useState(null);
  // Nueva pestaña para secciones: 0=Gastos, 1=Gráficos
  const [mainTab, setMainTab] = React.useState(0);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#4f8cff' },
      background: { default: '#232b38', paper: '#232b38' },
    },
  });

  const openModal = () => {
    setEditingExpense(null);
    setDateValue(null);
    setShowModal(true);
  };
  const closeModal = () => {
    setEditingExpense(null);
    setShowModal(false);
  };

  // Eliminar gasto
  const handleDelete = (id) => {
    fetch(`http://localhost:5002/expenses/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setExpenses(expenses.filter((e) => e._id !== id)));
  };

  // Editar gasto: abrir modal precargado
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setDateValue(expense.date ? new Date(expense.date) : null);
    setShowModal(true);
  };

  // Registrar o actualizar gasto
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    // Formatear la fecha seleccionada
    if (dateValue) {
      const yyyy = dateValue.getFullYear();
      const mm = String(dateValue.getMonth() + 1).padStart(2, "0");
      const dd = String(dateValue.getDate()).padStart(2, "0");
      data.date = `${yyyy}-${mm}-${dd}`;
    }
    if (editingExpense) {
      // EDITAR
      fetch(`http://localhost:5002/expenses/${editingExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          setExpenses(
            expenses.map((e) => (e.id === editingExpense.id ? res.expense : e))
          );
          closeModal();
        });
    } else {
      // ALTA
      fetch("http://localhost:5002/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setExpenses((prev) => [...prev, data.expense]);
          event.target.reset();
          closeModal();
        });
    }
  };
  // Limpiar todos los gastos (backend y frontend)
  const clearAllExpenses = () => {
    fetch("http://localhost:5002/expenses/all", { method: "DELETE" }).then(() =>
      setExpenses([])
    );
  };

  React.useEffect(() => {
    fetch("http://localhost:5002/expenses")
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((error) => console.error("Error al cargar gastos:", error));
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: '#181c24', minHeight: '100vh', color: '#fff', padding: '0 0 80px 0' }}>
        {/* Tabs principales para cambiar entre Gastos y Gráficos */}
        <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)} textColor="inherit" indicatorColor="primary" sx={{ mb: 2 }}>
          <Tab label="Gastos" />
          <Tab label="Gráficos" />
        </Tabs>
        {/* Vista de Gastos */}
        {mainTab === 0 && (
          <div className="App">
            <section
              style={{ width: "100%", maxWidth: 500, margin: "32px auto 0 auto" }}
            >
              <ExpenseFilters filters={filters} setFilters={setFilters} />
                <ul style={{ listStyle: "none", padding: 0 }}>
                {[...expenses]
  .filter(expense => 
    (filters.category ? expense.category === filters.category : true) &&
    (filters.subcategory ? (expense.subcategory || '').toLowerCase() === filters.subcategory.toLowerCase() : true) &&
    (filters.local ? ((expense.place || '').toString().toLowerCase().includes(filters.local.toLowerCase())) : true)
  )
  .sort((a, b) => {
    // Maneja fechas tipo string (YYYY-MM-DD) o Date
    const da = a.date ? new Date(a.date) : new Date(0);
    const db = b.date ? new Date(b.date) : new Date(0);
    return db - da; // descendente: más reciente primero
  })
  .map((expense) => {
                  let icon;
                  // Usar _id como key y para borrar
                  const expenseId = expense._id;
                  icon = (
                    <FaQuestionCircle
                      color="#bbb"
                      size={20}
                      style={{ marginRight: 8 }}
                    />
                  );
                  switch (expense.category) {
                    case "Casa":
                      icon = (
                        <FaHome color="#bbb" size={20} style={{ marginRight: 8 }} />
                      );
                      break;
                    case "Transporte":
                      icon = (
                        <FaCar color="#bbb" size={20} style={{ marginRight: 8 }} />
                      );
                      break;
                    case "Comida":
                      icon = (
                        <FaUtensils
                          color="#bbb"
                          size={20}
                          style={{ marginRight: 8 }}
                        />
                      );
                      break;
                    case "Salud":
                      icon = (
                        <FaHeartbeat
                          color="#bbb"
                          size={20}
                          style={{ marginRight: 8 }}
                        />
                      );
                      break;
                    case "Regalos":
                      icon = (
                        <FaGift color="#bbb" size={20} style={{ marginRight: 8 }} />
                      );
                      break;
                    case "Indumetaria":
                      icon = (
                        <FaTshirt color="#bbb" size={20} style={{ marginRight: 8 }} />
                      );
                      break;
                    case "Cuidado personal":
                      icon = (
                        <FaUserFriends
                          color="#bbb"
                          size={20}
                          style={{ marginRight: 8 }}
                        />
                      );
                      break;
                    case "Salida":
                      icon = (
                        <FaRegStar
                          color="#bbb"
                          size={20}
                          style={{ marginRight: 8 }}
                        />
                      );
                      break;
                    default:
                      break;
                  }
                  return (
                    <li
                      key={expenseId}
                      style={{
                        background: "#232323",
                        color: "#fff",
                        borderRadius: 8,
                        marginBottom: 12,
                        padding: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {icon}
                          <Chip
                            label={expense.category}
                            size="small"
                            sx={{
                              backgroundColor: 
                                expense.category === 'Casa' ? '#ffecb3' :
                                expense.category === 'Transporte' ? '#bbdefb' :
                                expense.category === 'Comida' ? '#c8e6c9' :
                                expense.category === 'Salud' ? '#f8bbd0' :
                                expense.category === 'Cuidado Personal' ? '#e1bee7' :
                                expense.category === 'Regalos' ? '#ffcdd2' :
                                expense.category === 'Indumetaria' ? '#d1c4e9' :
                                expense.category === 'Salida' ? '#b3e5fc' :
                                '#e0e0e0',
                              color: 
                                expense.category === 'Casa' ? '#ff6f00' :
                                expense.category === 'Transporte' ? '#0d47a1' :
                                expense.category === 'Comida' ? '#1b5e20' :
                                expense.category === 'Salud' ? '#880e4f' :
                                expense.category === 'Cuidado Personal' ? '#6a1b9a' :
                                expense.category === 'Regalos' ? '#b71c1c' :
                                expense.category === 'Indumetaria' ? '#4527a0' :
                                expense.category === 'Salida' ? '#01579b' :
                                '#424242',
                              fontWeight: 600,
                              fontSize: '0.85rem'
                            }}
                          />
                          <span style={{color: '#aaa'}}>{expense.subcategory}</span>
                        </div>
                        <span style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => handleEdit(expense)}
                            title="Editar"
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              margin: 0,
                              cursor: "pointer",
                              color: "#bbb",
                            }}
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (!expenseId) {
                                console.error(
                                  "Error: el gasto no tiene _id. No se puede eliminar.",
                                  expense
                                );
                                alert(
                                  "No se puede eliminar este gasto porque no tiene _id asignado."
                                );
                                return;
                              }
                              handleDelete(expenseId);
                            }}
                            title="Eliminar"
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              margin: 0,
                              cursor: "pointer",
                              color: "#b44",
                            }}
                          >
                            <FaTrashAlt size={18} />
                          </button>
                        </span>
                      </div>
                      <div>Local: <span>{expense.local || expense.place || ''}</span></div>
                      <div style={{marginTop: '10px'}}>
                        <div className="badge-monto">
                          {(() => {
                            const nf = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            const [entero, decimales] = nf.format(Number(expense.amount)).split(',');
                            return <>
                              ${entero}
                              <sup style={{ fontSize: '0.7em', opacity: 0.85, marginLeft: 1 }}>{decimales}</sup>
                            </>;
                          })()}
                        </div>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'}}>
                          {/* Fecha */}
                          <Chip 
                            label={(() => {
                              if (!expense.date) return '';
                              const d = new Date(expense.date);
                              const day = String(d.getDate()).padStart(2, '0');
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const year = d.getFullYear();
                              return `${day}/${month}/${year}`;
                            })()}
                            size="small"
                            sx={{
                              backgroundColor: '#22242a',
                              color: '#e0e6f0',
                              fontWeight: 500,
                              fontSize: '0.85rem'
                            }}
                          />
                          {/* Método de pago */}
                          <Chip 
                            label={expense.paymentMethod}
                            size="small"
                            sx={{
                              backgroundColor: 
                                expense.paymentMethod === 'Crédito' ? '#e3f0ff' :
                                expense.paymentMethod === 'Efectivo' ? '#e5f8e5' :
                                expense.paymentMethod === 'Débito' ? '#fff8e1' :
                                expense.paymentMethod === 'Transferencia' ? '#e8eaf6' :
                                expense.paymentMethod === 'MercadoPago' ? '#e1f5fe' :
                                '#e0e0e0',
                              color: 
                                expense.paymentMethod === 'Crédito' ? '#205080' :
                                expense.paymentMethod === 'Efectivo' ? '#1b5e20' :
                                expense.paymentMethod === 'Débito' ? '#bf8f00' :
                                expense.paymentMethod === 'Transferencia' ? '#3949ab' :
                                expense.paymentMethod === 'MercadoPago' ? '#0288d1' :
                                '#424242',
                              fontWeight: 500,
                              fontSize: '0.85rem'
                            }}
                          />
                          {/* Pagado por */}
                          <Chip 
                            label={expense.paidBy}
                            size="small"
                            sx={{
                              backgroundColor: 
                                expense.paidBy === 'José' ? '#e1fbe7' :
                                expense.paidBy === 'Maru' ? '#f3e1fb' :
                                expense.paidBy === 'Ana' ? '#ffe0b2' :
                                expense.paidBy === 'Carlos' ? '#bbdefb' :
                                '#ececec',
                              color: 
                                expense.paidBy === 'José' ? '#1a6d3b' :
                                expense.paidBy === 'Maru' ? '#6d1a6d' :
                                expense.paidBy === 'Ana' ? '#e65100' :
                                expense.paidBy === 'Carlos' ? '#0d47a1' :
                                '#333',
                              fontWeight: 500,
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
            <button
              className="add-expense-btn"
              onClick={openModal}
              aria-label="Agregar Gasto"
            >
              <FaPlus size={28} color="#fff" />
            </button>
          </div>
        )}
        {/* Vista de Gráficos */}
        {mainTab === 1 && (
          <ChartsSection expenses={expenses} />
        )}
        {/* Modal global, siempre disponible */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaWallet color="#fff" size={22} /> Registrar Gasto
              </h2>
              <form onSubmit={handleSubmit} className="expense-form">
                <select
                  name="category"
                  required
                  defaultValue={editingExpense?.category || ""}
                >
                  <option value="">Categoría</option>
                  <option>Transporte</option>
                  <option>Salida</option>
                  <option>Salud</option>
                  <option>Comida</option>
                  <option>Casa</option>
                  <option>Cuidado personal</option>
                  <option>Regalos</option>
                  <option>Indumetaria</option>
                </select>
                <select
                  name="subcategory"
                  required
                  defaultValue={editingExpense?.subcategory || ""}
                >
                  <option value="">Subcategoría</option>
                  <option>Nafta</option>
                  <option>Brunch</option>
                  <option>Consulta</option>
                  <option>Supermercado</option>
                  <option>Gas</option>
                  <option>Verdulería</option>
                  <option>Luz</option>
                  <option>Farmacia</option>
                  <option>Entretenimiento</option>
                  <option>Limpieza</option>
                  <option>Expensas</option>
                  <option>Cumpleaños</option>
                  <option>Calzado</option>
                  <option>Café</option>
                  <option>Propina</option>
                  <option>Marta</option>
                  <option>Ferretería</option>
                  <option>Prepaga</option>
                  <option>Panadería</option>
                  <option>Bazar</option>
                  <option>Carniceria</option>
                  <option>Heladeria</option>
                  <option>Dietetica</option>
                  <option>Merienda</option>
                  <option>Internet</option>
                  <option>Cena</option>
                  <option>Libreria</option>
                  <option>Peluquería</option>
                  <option>Salida</option>
                </select>
                <input
                  type="text"
                  name="local"
                  placeholder="Locales"
                  required
                  defaultValue={editingExpense?.local || ""}
                />
                <select
                  name="paymentMethod"
                  required
                  defaultValue={editingExpense?.paymentMethod || ""}
                >
                  <option value="">Medio de Pago</option>
                  <option>Crédito</option>
                  <option>Contado</option>
                </select>
                <select
                  name="paidBy"
                  required
                  defaultValue={editingExpense?.paidBy || ""}
                >
                  <option value="">Pagado por</option>
                  <option>José</option>
                  <option>Maru</option>
                </select>
                <input
                  type="number"
                  name="amount"
                  placeholder="Monto"
                  required
                  defaultValue={editingExpense?.amount || ""}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                  <DatePicker
                    label="Fecha"
                    value={dateValue}
                    onChange={setDateValue}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField {...params} name="date" required fullWidth sx={{ mb: 2 }} />
                    )}
                  />
                </LocalizationProvider>
                <button type="submit">
                  {editingExpense ? "Guardar Cambios" : "Registrar Gasto"}
                </button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={closeModal}
                  style={{ marginTop: 8 }}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
