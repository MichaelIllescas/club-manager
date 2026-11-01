import Footer from "../Index/Footer";
import { formatearMoneda } from "../Utils/formatearMoneda";
import Header from "../Navbar/Header";
import { COLOR_ANIO, COLOR_ANTERIOR, opcionesGrafico } from "../Utils/estiloGraficos";
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

// Registrar los componentes de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const VerRecaudacionesTrimestrales = () => {
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [datosTrimestrales, setDatosTrimestrales] = useState([]);
  const [datosAnioAnterior, setDatosAnioAnterior] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecaudaciones = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/api/recaudaciones/mensuales?year=${anioSeleccionado}`
        );

        const datos = response.data;
        const trimestres = [
          datos.slice(0, 3).reduce((acc, val) => acc + val, 0),
          datos.slice(3, 6).reduce((acc, val) => acc + val, 0),
          datos.slice(6, 9).reduce((acc, val) => acc + val, 0),
          datos.slice(9, 12).reduce((acc, val) => acc + val, 0),
        ];
        setDatosTrimestrales(trimestres);

        // Obtener datos del año anterior para comparación
        const responseAnterior = await apiClient.get(
          `/api/recaudaciones/mensuales?year=${anioSeleccionado - 1}`
        );
        const datosAnteriores = responseAnterior.data;
        const trimestresAnteriores = [
          datosAnteriores.slice(0, 3).reduce((acc, val) => acc + val, 0),
          datosAnteriores.slice(3, 6).reduce((acc, val) => acc + val, 0),
          datosAnteriores.slice(6, 9).reduce((acc, val) => acc + val, 0),
          datosAnteriores.slice(9, 12).reduce((acc, val) => acc + val, 0),
        ];
        setDatosAnioAnterior(trimestresAnteriores);
      } catch (err) {
        console.error("Error al obtener las recaudaciones:", err);
        setError("No se pudieron cargar las recaudaciones. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecaudaciones();
  }, [anioSeleccionado]);

  const trimestresLabels = ["Q1 (Ene-Mar)", "Q2 (Abr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dic)"];

  const data = {
    labels: trimestresLabels,
    datasets: [
      {
        label: `${anioSeleccionado}`,
        data: datosTrimestrales,
        backgroundColor: COLOR_ANIO,
        borderRadius: 4,
        borderWidth: 1,
      },
      {
        label: `${anioSeleccionado - 1} (año anterior)`,
        data: datosAnioAnterior,
        backgroundColor: COLOR_ANTERIOR,
        borderRadius: 4,
        borderWidth: 1,
      },
    ],
  };

  const options = opcionesGrafico();

  const totalRecaudaciones = datosTrimestrales.reduce((total, valor) => total + (valor || 0), 0);
  const totalRecaudacionesAnterior = datosAnioAnterior.reduce((total, valor) => total + (valor || 0), 0);
  const diferencia = totalRecaudaciones - totalRecaudacionesAnterior;
  const porcentajeCrecimiento = totalRecaudacionesAnterior !== 0 
    ? ((diferencia / totalRecaudacionesAnterior) * 100).toFixed(2) 
    : "N/A";

  return (
    <>
      <Header />
      <div className="my-5 pt-1 pb-5">
        <div className="container my-5 panel py-3 rounded my-5">
          <div className="text-center mb-4">
            <h1>Recaudación trimestral</h1>
            <label htmlFor="anio"className="">Seleccione el año: </label>
            <select
              id="anio"
              value={anioSeleccionado}
              onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
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
                    <p><strong>Año seleccionado:</strong> {anioSeleccionado}</p>
                    <p><strong>Total recaudado en {anioSeleccionado}:</strong> {formatearMoneda(totalRecaudaciones)}</p>
                    <p><strong>Total recaudado en {anioSeleccionado - 1}:</strong> {formatearMoneda(totalRecaudacionesAnterior)}</p>
                    <p><strong>Diferencia:</strong> {diferencia >= 0 ? `+${formatearMoneda(diferencia)}` : `-${formatearMoneda(Math.abs(diferencia))}`}</p>
                    <p><strong>Crecimiento:</strong> {porcentajeCrecimiento !== "N/A" ? `${porcentajeCrecimiento}%` : "No disponible"}</p>
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
                    {trimestresLabels.map((trimestre, index) => (
                      <tr key={index}>
                        <td>{trimestre}</td>
                        <td>{formatearMoneda(datosTrimestrales[index])}</td>
                      </tr>
                    ))}
                    <tr>
                      <td><strong>Total</strong></td>
                      <td><strong>{formatearMoneda(totalRecaudaciones)}</strong></td>
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

export default VerRecaudacionesTrimestrales;
