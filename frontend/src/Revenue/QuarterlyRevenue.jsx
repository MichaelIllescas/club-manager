import Footer from "../Pages/Footer";
import { formatCurrency } from "../Utils/formatCurrency";
import Header from "../Navbar/Header";
import { SELECTED_YEAR_COLOR, PREVIOUS_YEAR_COLOR, chartOptions } from "../Utils/chartStyles";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const QuarterlyRevenue = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [quarterlyData, setQuarterlyData] = useState([]);
  const [previousYearData, setPreviousYearData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/api/revenue/monthly?year=${selectedYear}`
        );

        const data = response.data;
        const quarters = [
          data.slice(0, 3).reduce((acc, val) => acc + val, 0),
          data.slice(3, 6).reduce((acc, val) => acc + val, 0),
          data.slice(6, 9).reduce((acc, val) => acc + val, 0),
          data.slice(9, 12).reduce((acc, val) => acc + val, 0),
        ];
        setQuarterlyData(quarters);

        const previousResponse = await apiClient.get(
          `/api/revenue/monthly?year=${selectedYear - 1}`
        );
        const previousData = previousResponse.data;
        const previousQuarters = [
          previousData.slice(0, 3).reduce((acc, val) => acc + val, 0),
          previousData.slice(3, 6).reduce((acc, val) => acc + val, 0),
          previousData.slice(6, 9).reduce((acc, val) => acc + val, 0),
          previousData.slice(9, 12).reduce((acc, val) => acc + val, 0),
        ];
        setPreviousYearData(previousQuarters);
      } catch (err) {
        console.error("Error al obtener las recaudaciones:", err);
        setError("No se pudieron cargar las recaudaciones. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenues();
  }, [selectedYear]);

  const quarterLabels = ["Q1 (Ene-Mar)", "Q2 (Abr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dic)"];

  const data = {
    labels: quarterLabels,
    datasets: [
      {
        label: `${selectedYear}`,
        data: quarterlyData,
        backgroundColor: SELECTED_YEAR_COLOR,
        borderRadius: 4,
        borderWidth: 1,
      },
      {
        label: `${selectedYear - 1} (año anterior)`,
        data: previousYearData,
        backgroundColor: PREVIOUS_YEAR_COLOR,
        borderRadius: 4,
        borderWidth: 1,
      },
    ],
  };

  const options = chartOptions();

  const totalRevenue = quarterlyData.reduce((total, value) => total + (value || 0), 0);
  const totalPreviousRevenue = previousYearData.reduce((total, value) => total + (value || 0), 0);
  const difference = totalRevenue - totalPreviousRevenue;
  const percentageGrowth = totalPreviousRevenue !== 0 
    ? ((difference / totalPreviousRevenue) * 100).toFixed(2) 
    : "N/A";

  return (
    <>
      <Header />
      <div className="my-5 pt-1 pb-5">
        <div className="container my-5 panel py-3 rounded my-5">
          <div className="text-center mb-4">
            <h1>Recaudación trimestral</h1>
            <label htmlFor="year"className="">Seleccione el año: </label>
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
                  <Bar data={data} options={options} />
                </div>
                <div className="col-lg-4">
                  <div className="panel p-4 rounded">
                    <h3 className="mb-3">Resumen trimestral</h3>
                    <p><strong>Año seleccionado:</strong> {selectedYear}</p>
                    <p><strong>Total recaudado en {selectedYear}:</strong> {formatCurrency(totalRevenue)}</p>
                    <p><strong>Total recaudado en {selectedYear - 1}:</strong> {formatCurrency(totalPreviousRevenue)}</p>
                    <p><strong>Diferencia:</strong> {difference >= 0 ? `+${formatCurrency(difference)}` : `-${formatCurrency(Math.abs(difference))}`}</p>
                    <p><strong>Crecimiento:</strong> {percentageGrowth !== "N/A" ? `${percentageGrowth}%` : "No disponible"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Trimestre</th>
                      <th>Recaudación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarterLabels.map((quarter, index) => (
                      <tr key={index}>
                        <td>{quarter}</td>
                        <td>{formatCurrency(quarterlyData[index])}</td>
                      </tr>
                    ))}
                    <tr>
                      <td><strong>Total</strong></td>
                      <td><strong>{formatCurrency(totalRevenue)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

      </div>
      
      <Footer />
    </>
  );
};

export default QuarterlyRevenue;
