import React from "react";
import ReactECharts from "echarts-for-react";
import CATEGORY_COLORS from "./categoryColors";

function getCategoryData(expenses) {
  const sums = {};
  expenses.forEach((e) => {
    sums[e.category] = (sums[e.category] || 0) + e.amount;
  });
  return Object.entries(sums).map(([category, value]) => ({
    value,
    name: category,
    itemStyle: { color: CATEGORY_COLORS[category] || "#B0BEC5" },
  }));
}

import { useMemo } from "react";

export default function PieChartByCategory({ expenses, selectedMonth }) {
  // Filtrar gastos por mes
  const filteredExpenses = useMemo(() => {
    if (selectedMonth === -1) return expenses;
    
    return expenses.filter(expense => {
      // Parsear la fecha manualmente para evitar problemas de zona horaria
      const [year, month] = expense.date.split('-').map(Number);
      // Los meses en JavaScript van de 0 (enero) a 11 (diciembre)
      // Por eso restamos 1 al mes de la fecha
      return (month - 1) === selectedMonth;
    });
  }, [expenses, selectedMonth]);

  const data = getCategoryData(filteredExpenses);
  const option = {
    backgroundColor: "#181c24",
    tooltip: {
      trigger: "item",
      valueFormatter: (value) =>
        new Intl.NumberFormat("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value),
      formatter: (params) =>
        `${params.name}: $${new Intl.NumberFormat("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value)} (${params.percent}%)`,
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
      left: "center",
      type: "plain", // NO scroll
      textStyle: { color: "#eee" },
      width: "100%",
      itemWidth: 14,
      itemHeight: 14,
    },
    grid: {
      left: 70,
      right: 20,
      top: 20,
      bottom: 80,
    },
    series: [
      {
        name: "Gastos por Categoría",
        type: "pie",
        radius: "70%",
        data,
        label: {
          color: "#eee",
          formatter: (params) =>
            `${params.name}: $${new Intl.NumberFormat("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(params.value)} (${params.percent}%)`,
        },
      },
    ],
  };
  return <ReactECharts option={option} style={{ minHeight: 450 }} />;
}
