import { formatearMoneda } from "./formatearMoneda";

// Colores del tema para los gráficos: el año elegido en verde, el anterior en gris
export const COLOR_ANIO = "#1f5e3b";
export const COLOR_ANIO_RELLENO = "rgba(31, 94, 59, 0.12)";
export const COLOR_ANTERIOR = "#8a978f";

const TINTA_SUAVE = "#4e5d55";
const LINEA = "#e3e8e1";
const FUENTE = { family: "Barlow", size: 13 };

// Opciones comunes: referencias visibles arriba, montos en pesos en el eje y en el tooltip
export const opcionesGrafico = () => ({
  responsive: true,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "end",
      labels: {
        color: TINTA_SUAVE,
        font: { ...FUENTE, weight: "600" },
        usePointStyle: true,
        pointStyle: "rectRounded",
        padding: 16,
      },
    },
    tooltip: {
      callbacks: {
        label: (contexto) => `${contexto.dataset.label}: ${formatearMoneda(contexto.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: TINTA_SUAVE, font: FUENTE },
    },
    y: {
      beginAtZero: true,
      grid: { color: LINEA },
      border: { display: false },
      ticks: {
        color: TINTA_SUAVE,
        font: FUENTE,
        callback: (valor) => formatearMoneda(valor).replace(",00", ""),
      },
    },
  },
});
