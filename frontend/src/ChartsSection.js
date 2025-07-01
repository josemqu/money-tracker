import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import PieChartByCategory from "./PieChartByCategory";
import BarChartByMonth from "./BarChartByMonth";

export default function ChartsSection({ expenses = [] }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [year, setYear] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(-1); // -1 = Todos

  // Cargar categorías
  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesService = await import("./services/categoriesServices");
        const [cats] = await Promise.all([
          categoriesService.fetchCategories(),
          categoriesService.fetchSubcategories(),
        ]);

        if (!isMounted) return;

        if (!Array.isArray(cats) || cats.length === 0) {
          console.warn("No se recibieron categorías desde la API");
        }

        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calcular años disponibles
  const availableYears = useMemo(
    () =>
      Array.from(
        new Set(expenses.map((e) => new Date(e.date).getFullYear()))
      ).sort((a, b) => b - a),
    [expenses]
  );

  // Establecer año por defecto cuando cambian los gastos o availableYears
  useEffect(() => {
    if (availableYears.length > 0 && year === null) {
      setYear(availableYears[0]);
    }
  }, [availableYears, year]);

  const handleTabChange = useCallback((_, newValue) => {
    setTab(newValue);
  }, []);

  const handleYearChange = useCallback((e) => {
    setYear(e.target.value);
    setSelectedMonth(-1); // Resetear mes a 'Todos' al cambiar año
  }, []);

  const handleCategoryChange = useCallback((e) => {
    const value = e.target.value;
    // On autofill we get a stringified value.
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedMonth(-1); // Reset to 'Todos' for month
    setSelectedCategories([]); // Clear all category selections
    // Set year to the first available year if needed
    if (availableYears.length > 0) {
      setYear(availableYears[0]);
    }
  }, [availableYears]);

  // Función para parsear fechas de manera segura (formato YYYY-MM-DD)
  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return { year, month, day };
  };

  // Filtros aplicados a los gastos
  const filteredExpenses = useMemo(() => {
    if (!year) return [];

    return expenses.filter((exp) => {
      const { year: expYear } = parseDate(exp.date);
      const matchYear = expYear === year;
      const matchCategory =
        selectedCategories.length > 0
          ? selectedCategories.includes(exp.category)
          : true;
      return matchYear && matchCategory;
    });
  }, [expenses, year, selectedCategories]);

  // Meses presentes en los gastos filtrados
  const { monthNumbers, months } = useMemo(() => {
    const monthSet = new Set();

    filteredExpenses.forEach((exp) => {
      const { month } = parseDate(exp.date);
      monthSet.add(month - 1); // Convertir a 0-11 para consistencia
    });

    const uniqueMonths = Array.from(monthSet).sort((a, b) => a - b);

    return {
      monthNumbers: uniqueMonths,
      months: uniqueMonths.map((m) =>
        new Date(2000, m).toLocaleString("es", { month: "short" })
      ),
    };
  }, [filteredExpenses]);

  // Memoizar los componentes de los gráficos
  const chartContent = useMemo(() => {
    if (isLoading || year === null) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <CircularProgress />
        </Box>
      );
    }

    const barChartExpenses =
      selectedMonth === -1
        ? filteredExpenses
        : filteredExpenses
            .filter((exp) => {
              const { month } = parseDate(exp.date);
              return month - 1 === selectedMonth; // Convertir a 0-11 para comparar
            })
            .map((e) => ({
              ...e,
              subcategory:
                typeof e.subcategory === "object"
                  ? e.subcategory.name
                  : e.subcategory,
            }));

    return (
      <>
        {tab === 0 && <BarChartByMonth expenses={barChartExpenses} />}
        {tab === 1 && (
          <PieChartByCategory
            expenses={filteredExpenses}
            selectedMonth={selectedMonth}
          />
        )}
      </>
    );
  }, [tab, filteredExpenses, selectedMonth, isLoading, year]);

  // Memoizar los controles de filtro
  const filterControls = useMemo(
    () => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "top",
          flexWrap: "wrap",
          gap: 2,
          mt: 2,
        }}
      >
        <FormControl sx={{ width: "100%" }} size="small">
          <InputLabel sx={{ color: "#fff" }} shrink>
            Categoría
          </InputLabel>
          <Select
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            label="Categoría"
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) {
                return "Todas";
              }
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    maxWidth: "100%",
                  }}
                >
                  {selected.map((value) => (
                    <Box
                      key={value}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: "0.8rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {value}
                    </Box>
                  ))}
                </Box>
              );
            }}
            sx={{
              color: "#fff",
              borderColor: "#fff",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "4px",
                maxWidth: "100%",
                overflow: "hidden",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  width: 200,
                  bgcolor: "#2d2d2d",
                  "& .MuiMenuItem-root": {
                    whiteSpace: "normal",
                    minHeight: "32px",
                    padding: "6px 16px",
                  },
                },
              },
            }}
            disabled={isLoading}
          >
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
                <MenuItem
                  dense
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategories([...categories]);
                  }}
                  sx={{
                    flex: 1,
                    fontSize: "0.8rem",
                    textAlign: "center",
                    bgcolor: "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Seleccionar todas
                </MenuItem>
                <MenuItem
                  dense
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategories([]);
                  }}
                  sx={{
                    flex: 1,
                    fontSize: "0.8rem",
                    textAlign: "center",
                    bgcolor: "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Limpiar
                </MenuItem>
              </Box>
            </Box>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 200 }} size="small">
          <InputLabel sx={{ color: "#fff" }}>Año</InputLabel>
          <Select
            value={year || ""}
            onChange={handleYearChange}
            label="Año"
            sx={{
              color: "#fff",
              borderColor: "#fff",
              "& .MuiSelect-select": {
                minWidth: "100px",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  width: 200,
                  bgcolor: "#2d2d2d",
                },
              },
            }}
            disabled={isLoading}
          >
            {availableYears.map((y) => (
              <MenuItem value={y} key={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 200 }} size="small">
          <InputLabel sx={{ color: "#fff" }}>Mes</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            label="Mes"
            sx={{
              color: "#fff",
              borderColor: "#fff",
              "& .MuiSelect-select": {
                minWidth: "100px",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  width: 200,
                  bgcolor: "#2d2d2d",
                },
              },
            }}
            disabled={isLoading}
          >
            <MenuItem value={-1}>Todos</MenuItem>
            {monthNumbers.map((m, idx) => (
              <MenuItem value={m} key={m}>
                {months[idx]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="Limpiar todos los filtros">
          <IconButton
            aria-label="limpiar filtros"
            onClick={handleClearFilters}
            sx={{
              color: "#bbb",
              alignSelf: "center",
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <DeleteSweepIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    [
      year,
      selectedCategories,
      categories,
      monthNumbers,
      months,
      selectedMonth,
      handleYearChange,
      handleCategoryChange,
      handleClearFilters,
      isLoading,
      availableYears,
    ]
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
          disabled={isLoading}
        >
          <Tab
            label="Por Mes"
            sx={{
              color: "#fff",
              fontSize: 8,
              textTransform: "none",
              opacity: isLoading ? 0.5 : 1,
            }}
          />
          <Tab
            label="Por Categoría"
            sx={{
              color: "#fff",
              fontSize: 8,
              textTransform: "none",
              opacity: isLoading ? 0.5 : 1,
            }}
          />
        </Tabs>
      </Box>
      {filterControls}
      <Box sx={{ mt: 3 }}>{chartContent}</Box>
    </Paper>
  );
}
