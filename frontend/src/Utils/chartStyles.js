import { formatCurrency } from "./formatCurrency";

// Theme colors for charts: the selected year in green, the previous one in gray
export const SELECTED_YEAR_COLOR = "#1f5e3b";
export const SELECTED_YEAR_FILL = "rgba(31, 94, 59, 0.12)";
export const PREVIOUS_YEAR_COLOR = "#8a978f";

const INK_SOFT = "#4e5d55";
const LINE = "#e3e8e1";
const FONT = { family: "Barlow", size: 13 };

// Shared options: legend on top, amounts in pesos on the axis and in the tooltip
export const chartOptions = () => ({
  responsive: true,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "end",
      labels: {
        color: INK_SOFT,
        font: { ...FONT, weight: "600" },
        usePointStyle: true,
        pointStyle: "rectRounded",
        padding: 16,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: INK_SOFT, font: FONT },
    },
    y: {
      beginAtZero: true,
      grid: { color: LINE },
      border: { display: false },
      ticks: {
        color: INK_SOFT,
        font: FONT,
        callback: (value) => formatCurrency(value).replace(",00", ""),
      },
    },
  },
});
