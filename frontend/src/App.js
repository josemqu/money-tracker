import React from "react";
import "./App.css";
import {
  ExpensesProvider,
  useExpensesContext,
} from "./context/ExpensesContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ChartsSection from "./ChartsSection";
import ExpenseList from "./components/ExpenseList";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseForm from "./components/ExpenseForm";
import {
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Backdrop,
} from "@mui/material";
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
  const [showModal, setShowModal] = React.useState(false);
  const [filters, setFilters] = React.useState({ category: "", place: "" });
  const [editingExpense, setEditingExpense] = React.useState(null); // null = alta, objeto = edición
  const [mainTab, setMainTab] = React.useState(0);
  const { expenses, add, update, remove, clearAll, setExpenses, loading } =
    useExpensesContext();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#4f8cff" },
      background: { default: "#232b38", paper: "#232b38" },
    },
  });

  const openModal = () => {
    setEditingExpense(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingExpense(null);
    setShowModal(false);
  };

  // Eliminar gasto
  const handleDelete = (id) => {
    remove(id);
  };

  // Editar gasto: abrir modal precargado
  const handleEdit = (expense) => {
    console.log("[App] handleEdit called", expense);
    setEditingExpense(expense);
    setShowModal(true);
    setTimeout(() => {
      console.log("[App] showModal after setShowModal(true):", showModal);
    }, 100);
  };

  // Registrar o actualizar gasto
  const handleSubmit = (form) => {
    const data = { ...form };
    if (form.date) {
      // Ajustar a fecha local para evitar desfase por timezone
      const local = new Date(
        form.date.getTime() - form.date.getTimezoneOffset() * 60000
      );
      data.date = local.toISOString().slice(0, 10);
    } else {
      data.date = undefined;
    }
    if (editingExpense) {
      update(editingExpense.id || editingExpense._id, data).then(closeModal);
    } else {
      add(data).then(() => {
        closeModal();
      });
    }
  };

  // Limpiar todos los gastos
  const clearAllExpensesHandler = () => {
    clearAll();
  };

  // Filtrar gastos según filtros
  const filteredExpenses = expenses.filter((e) => {
    let ok = true;
    if (filters.category && e.category !== filters.category) ok = false;
    if (
      filters.place &&
      !(e.place || "").toLowerCase().includes(filters.place.toLowerCase())
    )
      ok = false;
    if (filters.subcategory && e.subcategory !== filters.subcategory)
      ok = false;
    return ok;
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          bgcolor: "#181c24",
          minHeight: "100vh",
          color: "#fff",
          padding: "0 0 80px 0",
        }}
      >
        <Tabs
          value={mainTab}
          onChange={(_, v) => setMainTab(v)}
          textColor="inherit"
          indicatorColor="primary"
          centered
          sx={{ mb: 2, zIndex: 1000, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Gastos" />
          <Tab label="Gráficos" />
        </Tabs>
        <div className="main-content">
          {mainTab === 0 && (
            <section
              className="App"
              style={{
                margin: "32px auto 0 auto",
              }}
            >
              <ExpenseFilters filters={filters} setFilters={setFilters} />
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <button
                className="add-expense-btn"
                onClick={openModal}
                aria-label="Agregar Gasto"
                style={{ marginTop: 16 }}
              >
                <FaPlus size={28} color="#fff" />
              </button>
            </section>
          )}
          {mainTab === 1 && <ChartsSection expenses={expenses} />}
        </div>
        <Dialog open={showModal} onClose={closeModal} maxWidth="xs" fullWidth>
          <DialogTitle
            sx={{
              bgcolor: "#232b38",
              color: "#fff",
              fontWeight: 700,
              pb: 1,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          >
            {editingExpense ? "Editar gasto" : "Agregar gasto"}
          </DialogTitle>
          <DialogContent
            sx={{
              bgcolor: "#232323",
              color: "#fff",
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              p: 3,
            }}
          >
            <ExpenseForm
              onSubmit={handleSubmit}
              onCancel={closeModal}
              editingExpense={editingExpense}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;
