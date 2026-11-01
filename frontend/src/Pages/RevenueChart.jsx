import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { formatCurrency } from "../Utils/formatCurrency";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const FIELD_GREEN = "#1f5e3b";
const CREST_GOLD = "#e0a731";
const LINE = "#e3e8e1";
const INK_SOFT = "#4e5d55";

// Revenue for each month of the year; the current month is highlighted in gold
const RevenueChart = ({ data }) => {
  const currentMonth = new Date().getMonth();

  const chartData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Recaudación",
        data: data || [],
        backgroundColor: MONTHS.map((_, i) => (i === currentMonth ? CREST_GOLD : FIELD_GREEN)),
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
          label: (context) => formatCurrency(context.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: INK_SOFT, font: { family: "Barlow", size: 13 } },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 1000,
        grid: { color: LINE },
        border: { display: false },
        ticks: {
          color: INK_SOFT,
          font: { family: "Barlow", size: 12 },
          callback: (value) => formatCurrency(value).replace(",00", ""),
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

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
};

export default RevenueChart;
