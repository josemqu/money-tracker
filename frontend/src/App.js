import React from "react";
import "./App.css";
import { useExpensesContext } from "./context/ExpensesContext";
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
import { FaPlus } from "react-icons/fa";

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
      // Tomar año, mes y día directamente del objeto Date, sin ajustar por zona horaria
      const year = form.date.getFullYear();
      const month = String(form.date.getMonth() + 1).padStart(2, "0");
      const day = String(form.date.getDate()).padStart(2, "0");
      data.date = `${year}-${month}-${day}`;
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
    console.log("data", data);
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
    if (filters.subcategory) {
      let subcatName = e.subcategory;
      if (typeof subcatName === "object" && subcatName !== null) {
        subcatName = subcatName.name;
      }
      if (subcatName !== filters.subcategory) ok = false;
    }
    return ok;
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Box
          sx={{
            bgcolor: "#181c24",
            minHeight: "100vh",
            color: "#fff",
            padding: "0 0 80px 0",
          }}
        >
          <Box
            sx={{
              position: "relative",
              borderBottom: "1px solid #222",
              minHeight: 56,
              px: 2,
              display: "flex",
              alignItems: "center",
              background: "#181c24",
              zIndex: 1201,
            }}
          >
            {/* Nombre de la app a la izquierda, absoluto */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                height: 56,
                display: "flex",
                alignItems: "center",
                px: 2,
                zIndex: 1300,
              }}
            >
              <span className="app-title">Gastos Claros</span>
              <img
                src="/icon-t.svg"
                alt="App icon"
                className="app-icon"
                style={{ height: 36, width: 36, marginLeft: 8 }}
              />
            </Box>
            {/* Tabs centrados respecto al viewport */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: 0,
                transform: "translateX(-50%)",
                height: 56,
                display: "flex",
                alignItems: "center",
                width: "max-content",
              }}
            >
              <Tabs
                value={mainTab}
                onChange={(_, v) => setMainTab(v)}
                textColor="inherit"
                indicatorColor="primary"
                sx={{ zIndex: 1000 }}
              >
                <Tab label="Gastos" />
                <Tab label="Gráficos" />
              </Tabs>
            </Box>
          </Box>
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
        </Box>
      )}
      <Dialog open={showModal} onClose={closeModal} maxWidth="xs" fullWidth>
        <DialogTitle>
          {editingExpense ? "Editar Gasto" : "Agregar Gasto"}
        </DialogTitle>
        <DialogContent>
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={closeModal}
            editingExpense={editingExpense}
          />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
