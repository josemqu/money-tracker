import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import CATEGORY_COLORS from "./categoryColors";

function getBarChartData(expenses) {
  if (!expenses || expenses.length === 0) {
    return { months: [], categories: [], data: [], totalsByMonth: [] };
  }

  // Primero, obtener todas las categorías únicas de todos los gastos
  const allCategories = new Set(expenses.map((e) => e.category));
  const categories = Array.from(allCategories);

  // Crear un mapa de año-mes para agrupar correctamente
  const yearMonthMap = new Map();

  // Primera pasada: inicializar todos los meses con todas las categorías
  expenses.forEach((expense) => {
    const [year, month] = expense.date.split("-").map(Number);
    const yearMonthKey = `${year}-${String(month).padStart(2, "0")}`;

    if (!yearMonthMap.has(yearMonthKey)) {
      const monthName = new Date(year, month - 1, 1).toLocaleString("es", {
        month: "short",
      });

      // Inicializar el mes con todas las categorías en 0
      const categoriesMap = new Map();
      categories.forEach((cat) => categoriesMap.set(cat, 0));

      yearMonthMap.set(yearMonthKey, {
        year,
        month: month - 1,
        monthName,
        categories: categoriesMap,
      });
    }
  });

  // Segunda pasada: sumar los montos a las categorías correspondientes
  expenses.forEach((expense) => {
    const [year, month] = expense.date.split("-").map(Number);
    const yearMonthKey = `${year}-${String(month).padStart(2, "0")}`;

    const monthData = yearMonthMap.get(yearMonthKey);
    if (monthData) {
      const currentAmount = monthData.categories.get(expense.category) || 0;
      monthData.categories.set(
        expense.category,
        currentAmount + expense.amount
      );
    }
  });

  // Ordenar los meses cronológicamente
  const sortedMonths = Array.from(yearMonthMap.entries()).sort(
    ([keyA], [keyB]) => keyA.localeCompare(keyB)
  );

  // Crear las etiquetas de los meses con año
  const monthNames = sortedMonths.map(
    ([_, monthData]) =>
      `${monthData.monthName} '${String(monthData.year).slice(2)}`
  );

  // Crear la matriz de datos para cada categoría
  const data = categories.map((category) => {
    return sortedMonths.map(([_, monthData]) => {
      return monthData.categories.get(category) || 0;
    });
  });

  // Calcular totales por mes
  const totalsByMonth = sortedMonths.map(([_, monthData]) => {
    return Array.from(monthData.categories.values()).reduce(
      (sum, amount) => sum + amount,
      0
    );
  });

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
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      valueFormatter: (value) =>
        new Intl.NumberFormat("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value),
    },
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
        formatter: (value) => {
          const formattedValue = new Intl.NumberFormat("es-AR", {
            useGrouping: true,
          }).format(value);
          return `${formattedValue}`;
        },
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
        // barMaxWidth: 40,
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
            formatter: (params) => {
              const formattedValue = new Intl.NumberFormat("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              }).format(params.value);
              return `$ ${formattedValue}`;
            },
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
