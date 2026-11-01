import Footer from "../Pages/Footer";
import { formatCurrency } from "../Utils/formatCurrency";
import { SELECTED_YEAR_COLOR, SELECTED_YEAR_FILL, PREVIOUS_YEAR_COLOR, chartOptions } from "../Utils/chartStyles";
import Header from "../Navbar/Header";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const AnnualRevenue = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [annualData, setAnnualData] = useState([]);
  const [previousYearData, setPreviousYearData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/api/revenue/monthly?year=${selectedYear}`
        );
        setAnnualData(response.data);

        const previousResponse = await apiClient.get(
          `/api/revenue/monthly?year=${selectedYear - 1}`
        );
        setPreviousYearData(previousResponse.data);
      } catch (err) {
        console.error("Error al obtener las recaudaciones:", err);
        setError("No se pudieron cargar las recaudaciones. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenues();
  }, [selectedYear]);

  const data = {
    labels: months,
    datasets: [
      {
        label: `${selectedYear}`,
        data: annualData,
        borderColor: SELECTED_YEAR_COLOR,
        backgroundColor: SELECTED_YEAR_FILL,
        pointBackgroundColor: SELECTED_YEAR_COLOR,
        borderWidth: 3,
        fill: true,
        tension: 0.25,
      },
      {
        label: `${selectedYear - 1} (año anterior)`,
        data: previousYearData,
        borderColor: PREVIOUS_YEAR_COLOR,
        backgroundColor: PREVIOUS_YEAR_COLOR,
        pointBackgroundColor: PREVIOUS_YEAR_COLOR,
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0.25,
      },
    ],
  };

  const options = chartOptions();

  const totalRevenue = annualData.reduce((total, value) => total + (value || 0), 0);
  const totalPreviousRevenue = previousYearData.reduce((total, value) => total + (value || 0), 0);
  const difference = totalRevenue - totalPreviousRevenue;
  const percentageGrowth = totalPreviousRevenue !== 0 
    ? ((difference / totalPreviousRevenue) * 100).toFixed(2) 
    : "N/A";

  return (
    <>
      <Header />
      <div className="pt-5 pb-5">
        <div className="container my-5 pt-5 pb-5 mb-5 panel rounded">
        <div className="text-center mb-4">
          <h1>Recaudación anual</h1>
          <label htmlFor="year" className="">Seleccione el año: </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="form-select w-auto d-inline-block ms-3"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={2025 + i}>{2025 + i}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center">Cargando datos...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <>
            <div className="row d-flex justify-content-center">
              <div className="col-lg-6">
                <Line data={data} options={options} />
              </div>
              <div className="col-lg-4">
                <div className="panel p-4 rounded">
                  <h3 className="mb-3">Resumen anual</h3>
                  <p><strong>Año seleccionado:</strong> {selectedYear}</p>
                  <p><strong>Total recaudado en {selectedYear}:</strong> {formatCurrency(totalRevenue)}</p>
                  <p><strong>Total recaudado en {selectedYear - 1}:</strong> {formatCurrency(totalPreviousRevenue)}</p>
                  {totalPreviousRevenue !== 0 && (
                    <p>
                      <strong>Diferencia respecto al año anterior:</strong> 
                      {difference >= 0 ? ` +${formatCurrency(difference)}` : ` -${formatCurrency(Math.abs(difference))}`}
                    </p>
                  )}
                  <p>
                    <strong>Porcentaje de crecimiento:</strong> {percentageGrowth !== "N/A" ? `${percentageGrowth}%` : "No disponible"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Recaudación</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((month, index) => (
                    <tr key={index}>
                      <td>{month}</td>
                      <td>{annualData[index] ? formatCurrency(annualData[index]) : formatCurrency(0)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>{formatCurrency(totalRevenue)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-lg-none panel p-4 rounded mt-4">
              <h3 className="mb-3">Resumen anual</h3>
              <p><strong>Año seleccionado:</strong> {selectedYear}</p>
              <p><strong>Total recaudado en {selectedYear}:</strong> {formatCurrency(totalRevenue)}</p>
              <p><strong>Total recaudado en {selectedYear - 1}:</strong> {formatCurrency(totalPreviousRevenue)}</p>
              <p><strong>Porcentaje de crecimiento:</strong> {percentageGrowth !== "N/A" ? `${percentageGrowth}%` : "No disponible"}</p>
            </div>
          </>
        )}
      </div>
      </div>
      
      <Footer />
    </>
  );
};

export default AnnualRevenue;
