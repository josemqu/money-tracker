import React, { useState } from "react";
import CATEGORY_COLORS from "./categoryColors";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PieChartByCategory from "./PieChartByCategory";
import BarChartByMonth from "./BarChartByMonth";

const mockCategories = [
  "Hogar",
  "Transporte",
  "Comida",
  "Salud",
  "Regalos",
  "Ropa",
  "Otros",
];

export default function ChartsSection({ expenses }) {
  // Obtener años presentes en los gastos ordenados de mayor a menor
  const availableYears = Array.from(
    new Set(expenses.map((e) => new Date(e.date).getFullYear()))
  ).sort((a, b) => b - a);
  const [tab, setTab] = useState(0);
  // Obtener el año más reciente de los gastos o undefined
  const latestYear = availableYears.length > 0 ? availableYears[0] : undefined;
  const [year, setYear] = useState(latestYear);
  const [category, setCategory] = useState("");
  // Selector de mes
  const [selectedMonth, setSelectedMonth] = useState(-1); // -1 = Todos

  const handleTabChange = (_, newValue) => setTab(newValue);
  // Si cambian los gastos, actualizar el año por defecto si es necesario
  React.useEffect(() => {
    if (expenses.length > 0) {
      const maxYear = Math.max(
        ...expenses.map((e) => new Date(e.date).getFullYear())
      );
      setYear(maxYear);
    } else {
      setYear(mockYears[mockYears.length - 1]);
    }
  }, [expenses]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setSelectedMonth(-1); // Resetear mes a 'Todos' al cambiar año
  };
  const handleCategoryChange = (e) => setCategory(e.target.value);

  // Filtros aplicados a los gastos
  const filteredExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const matchYear = expDate.getFullYear() === year;
    const matchCategory = category ? exp.category === category : true;
    return matchYear && matchCategory;
  });

  // Meses presentes en los gastos filtrados
  const monthNumbers = Array.from(
    new Set(filteredExpenses.map((e) => new Date(e.date).getMonth()))
  ).sort((a, b) => a - b);
  const months = monthNumbers.map((m) =>
    new Date(2000, m).toLocaleString("es", { month: "short" })
  );

  return (
    <Paper sx={{ p: 2, bgcolor: "#181c24" }}>
      <Box
        sx={{ display: "flex", borderBottom: 2, borderColor: "divider", mb: 1 }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={"Por Categoría"}
            sx={{
              color: "#fff",
              fontSize: 8,
              textTransform: "none",
            }}
          />
          <Tab
            label={"Por Mes"}
            sx={{
              color: "#fff",
              fontSize: 8,
              textTransform: "none",
            }}
          />
        </Tabs>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel sx={{ color: "#fff" }}>Año</InputLabel>
          <Select
            value={year}
            onChange={handleYearChange}
            label="Año"
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            {availableYears.map((y) => (
              <MenuItem value={y} key={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel sx={{ color: "#fff" }} shrink>
            Categoría
          </InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Categoría"
            displayEmpty
            renderValue={(v) => (v === "" ? "Todas" : v)}
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            <MenuItem value="">Todas</MenuItem>
            {mockCategories.map((cat) => (
              <MenuItem value={cat} key={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel sx={{ color: "#fff" }}>Mes</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            label="Mes"
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            <MenuItem value={-1}>Todos</MenuItem>
            {monthNumbers.map((m, idx) => (
              <MenuItem value={m} key={m}>
                {months[idx]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mt: 3 }}>
        {tab === 0 && (
          <PieChartByCategory
            expenses={filteredExpenses}
            selectedMonth={selectedMonth}
          />
        )}
        {tab === 1 && (
          <BarChartByMonth
            expenses={
              selectedMonth === -1
                ? filteredExpenses
                : filteredExpenses.filter(
                    (e) => new Date(e.date).getMonth() === selectedMonth
                  ).map((e) => ({
                    ...e,
                    subcategory:
                      typeof e.subcategory === "object"
                        ? e.subcategory.name
                        : e.subcategory,
                  }))
            }
          />
        )}
      </Box>
    </Paper>
  );
}
