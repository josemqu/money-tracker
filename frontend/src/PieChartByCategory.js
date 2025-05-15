import React from "react";
import ReactECharts from "echarts-for-react";
import CATEGORY_COLORS from "./categoryColors";

const COLORS = [
  "#ff6384",
  "#36a2eb",
  "#ffce56",
  "#4bc0c0",
  "#9966ff",
  "#ff9f40",
  "#607d8b"
];

function getCategoryData(expenses) {
  const sums = {};
  expenses.forEach(e => {
    sums[e.category] = (sums[e.category] || 0) + e.amount;
  });
  return Object.entries(sums).map(([category, value]) => ({
    value,
    name: category,
    itemStyle: { color: CATEGORY_COLORS[category] || '#B0BEC5' }
  }));
}

import { useMemo } from 'react';

export default function PieChartByCategory({ expenses, selectedMonth }) {
  // Filtrar gastos por mes
  const filteredExpenses = useMemo(() => {
    if (selectedMonth === -1) return expenses;
    return expenses.filter(e => new Date(e.date).getMonth() === selectedMonth);
  }, [expenses, selectedMonth]);

  const data = getCategoryData(filteredExpenses);
  const option = {
    backgroundColor: '#181c24',
    tooltip: {
      trigger: 'item',
      valueFormatter: value => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
      formatter: params => `${params.name}: $${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value)} (${params.percent}%)`
    },
    legend: {
      orient: 'horizontal',
      top: 0,
      left: 'center',
      textStyle: { color: '#fff' }
    },
    series: [
      {
        name: 'Gastos por Categoría',
        type: 'pie',
        radius: '70%',
        data,
        label: {
          color: '#fff',
          formatter: params => `${params.name}: $${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value)} (${params.percent}%)`
        }
      }
    ]
  };
  return (
    <ReactECharts option={option} style={{ height: 350 }} />
  );
}
