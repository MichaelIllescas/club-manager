import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { formatearMoneda } from "../Utils/formatearMoneda";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const CANCHA = "#1f5e3b";
const ESCUDO = "#e0a731";
const LINEA = "#e3e8e1";
const TINTA_SUAVE = "#4e5d55";

// Recaudación de cada mes del año; el mes actual se resalta en dorado
const GraficoIndex = ({ data }) => {
  const mesActual = new Date().getMonth();

  const chartData = {
    labels: MESES,
    datasets: [
      {
        label: "Recaudación",
        data: data || [],
        backgroundColor: MESES.map((_, i) => (i === mesActual ? ESCUDO : CANCHA)),
        borderRadius: 4,
        maxBarThickness: 42,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (contexto) => formatearMoneda(contexto.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: TINTA_SUAVE, font: { family: "Barlow", size: 13 } },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 1000,
        grid: { color: LINEA },
        border: { display: false },
        ticks: {
          color: TINTA_SUAVE,
          font: { family: "Barlow", size: 12 },
          callback: (valor) => formatearMoneda(valor).replace(",00", ""),
        },
      },
    },
  };

  return (
    <div style={{ height: 300 }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

GraficoIndex.propTypes = {
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
};

export default GraficoIndex;
