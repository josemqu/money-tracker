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

function getMonthCategoryData(expenses) {
  // Agrupa por mes y categoría SOLO para meses presentes en los datos
  const monthNumbers = Array.from(new Set(expenses.map(e => new Date(e.date).getMonth()))).sort((a, b) => a - b);
  const months = monthNumbers.map(m => new Date(2000, m).toLocaleString('es', { month: 'short' }));
  // Solo categorías con al menos un valor > 0
  const categorySet = new Set();
  const catDataMap = {};
  expenses.forEach(e => {
    const m = new Date(e.date).getMonth();
    const key = e.category;
    if (!catDataMap[key]) catDataMap[key] = Array(monthNumbers.length).fill(0);
    const monthIdx = monthNumbers.indexOf(m);
    if (monthIdx !== -1) {
      catDataMap[key][monthIdx] += e.amount;
    }
  });
  // Filtra categorías con al menos un valor > 0
  const cats = Object.keys(catDataMap).filter(cat => catDataMap[cat].some(v => v > 0));
  const data = cats.map(cat => catDataMap[cat]);
  return { months, monthNumbers, cats, data };
}


export default function BarChartByMonth({ expenses }) {
  const { months, monthNumbers, cats, data } = getMonthCategoryData(expenses);
  // Por defecto, el mes más reciente

  const option = {
    backgroundColor: '#181c24',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        // params es un array con los datos de cada serie en ese punto
        return params
          .filter(p => p.value > 0)
          .map(p => `${p.marker} <b>${p.seriesName}</b>: $${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p.value)}`)
          .join('<br />');
      }
    },
    legend: {
      data: cats,
      textStyle: { color: '#fff' }
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        formatter: value => new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
      }
    },
    series: cats.map((cat, i) => ({
      name: cat,
      type: 'bar',
      stack: 'total',
      data: data[i],
      itemStyle: { color: CATEGORY_COLORS[cat] || '#B0BEC5' }
    }))
  };

  return (
    <div>
      <ReactECharts option={option} style={{ height: 350 }} />
    </div>
  );
}
