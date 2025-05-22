import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import CATEGORY_COLORS from "./categoryColors";

function getBarChartData(expenses) {
  // Agrupa por mes y categoría
  const monthsSet = new Set(expenses.map((e) => new Date(e.date).getMonth()));
  const months = Array.from(monthsSet).sort((a, b) => a - b);
  const monthNames = months.map((m) =>
    new Date(2000, m).toLocaleString("es", { month: "short" })
  );

  const dataByCategory = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    const category = expense.category;
    if (!acc.has(category)) {
      acc.set(category, new Map());
    }
    const categoryData = acc.get(category);
    if (!categoryData.has(month)) {
      categoryData.set(month, 0);
    }
    categoryData.set(month, categoryData.get(month) + expense.amount);
    return acc;
  }, new Map());

  const categories = Array.from(dataByCategory.keys());
  const data = categories.map((category) => {
    const categoryData = dataByCategory.get(category);
    return months.map((month) => categoryData.get(month) || 0);
  });

  // Calcular totales por mes
  const totalsByMonth = months.map((_, monthIndex) =>
    data.reduce((sum, categoryData) => sum + (categoryData[monthIndex] || 0), 0)
  );

  return {
    months: monthNames,
    categories,
    data,
    totalsByMonth,
  };
}

export default function BarChartByMonth({ expenses }) {
  const { months, categories, data, totalsByMonth } = useMemo(
    () => getBarChartData(expenses),
    [expenses]
  );

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
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: {
        color: "#eee",
        rotate: 45,
        margin: 10,
      },
      axisLine: { lineStyle: { color: "#555" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#eee",
        formatter: (value) =>
          new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value / 1000) + " k",
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: "#2d323c",
          type: "dashed",
        },
      },
    },
    // Agregar una serie adicional para los totales que se mostrará como etiqueta
    series: [
      // Series de barras normales
      ...categories.map((category, index) => ({
        name: category,
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        data: data[index] || [],
        itemStyle: {
          color:
            CATEGORY_COLORS[category] ||
            `hsl(${(index * 137.5) % 360}, 70%, 60%)`,
          borderRadius: [2, 2, 0, 0],
        },
        barMaxWidth: 40,
        label: { show: false }, // Ocultamos las etiquetas individuales
      })),
      // Serie invisible para mostrar los totales
      {
        type: "bar",
        stack: "total",
        data: totalsByMonth.map((total) => ({
          value: total,
          // Configuración de la etiqueta
          label: {
            show: total > 0,
            position: "top",
            distance: 5,
            formatter: `$ ${total.toLocaleString("es-AR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`,
            rich: {
              a: {
                color: "#fff",
                fontSize: 12,
                fontWeight: "bold",
                textBorderColor: "#000",
                textBorderWidth: 2,
                textShadowBlur: 4,
                textShadowOffsetY: 1,
              },
            },
          },
        })),
        itemStyle: {
          color: "transparent", // Hacemos la barra transparente
          borderWidth: 0,
        },
        // Aseguramos que esta barra esté encima de las demás
        z: 100,
        // Deshabilitamos la interacción con esta barra
        silent: true,
        // Configuración para que la etiqueta se muestre correctamente
        labelLayout: {
          hideOverlap: true,
          moveOverlap: "shiftY",
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ minHeight: 450 }}
      opts={{ renderer: "canvas" }}
      onEvents={{
        legendselectchanged: (params) => {
          // Evitar que se deshabilite la última categoría seleccionada
          if (Object.values(params.selected).filter(Boolean).length === 0) {
            return false;
          }
        },
      }}
    />
  );
}
