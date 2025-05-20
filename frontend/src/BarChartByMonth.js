import React from "react";
import ReactECharts from "echarts-for-react";
import CATEGORY_COLORS from "./categoryColors";

function getBarChartData(expenses) {
  // Agrupa por mes y categoría
  const monthNumbers = Array.from(
    new Set(expenses.map((e) => new Date(e.date).getMonth()))
  ).sort((a, b) => a - b);
  const months = monthNumbers.map((m) =>
    new Date(2000, m).toLocaleString("es", { month: "short" })
  );
  const categories = Array.from(new Set(expenses.map((e) => e.category)));
  const data = categories.map((cat) =>
    monthNumbers.map((m) => {
      const total = expenses
        .filter((e) => e.category === cat && new Date(e.date).getMonth() === m)
        .reduce((sum, e) => sum + e.amount, 0);
      return total;
    })
  );
  return { months, categories, data };
}

export default function BarChartByMonth({ expenses }) {
  const { months, categories, data } = getBarChartData(expenses);

  const option = {
    backgroundColor: "#181c24",
    tooltip: {}, // tooltip simple por defecto
    legend: {
      data: categories,
      orient: "horizontal",
      bottom: 0,
      left: "center",
      type: "plain",
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
    xAxis: {
      type: "category",
      data: months,
      axisLabel: { color: "#eee" },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#eee",
        formatter: (value) =>
          new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value / 1000) + " k",
      },
    },
    series: categories.map((cat, i) => ({
      name: cat,
      type: "bar",
      stack: "total",
      data: data[i],
      itemStyle: { color: CATEGORY_COLORS[cat] || "#B0BEC5" },
    })),
  };
  return <ReactECharts option={option} style={{ minHeight: 450 }} />;
}
