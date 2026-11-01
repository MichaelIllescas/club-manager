import Footer from "../Index/Footer";
import { formatearMoneda } from "../Utils/formatearMoneda";
import { COLOR_ANIO, COLOR_ANIO_RELLENO, COLOR_ANTERIOR, opcionesGrafico } from "../Utils/estiloGraficos";
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

// Registrar los componentes de Chart.js
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const VerRecaudacionesAnuales = () => {
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [datosAnuales, setDatosAnuales] = useState([]);
  const [datosAnioAnterior, setDatosAnioAnterior] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    const fetchRecaudaciones = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/api/recaudaciones/mensuales?year=${anioSeleccionado}`
        );
        setDatosAnuales(response.data);

        // Obtener datos del año anterior para comparación
        const responseAnterior = await apiClient.get(
          `/api/recaudaciones/mensuales?year=${anioSeleccionado - 1}`
        );
        setDatosAnioAnterior(responseAnterior.data);
      } catch (err) {
        console.error("Error al obtener las recaudaciones:", err);
        setError("No se pudieron cargar las recaudaciones. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecaudaciones();
  }, [anioSeleccionado]);

  const data = {
    labels: meses,
    datasets: [
      {
        label: `${anioSeleccionado}`,
        data: datosAnuales,
        borderColor: COLOR_ANIO,
        backgroundColor: COLOR_ANIO_RELLENO,
        pointBackgroundColor: COLOR_ANIO,
        borderWidth: 3,
        fill: true,
        tension: 0.25,
      },
      {
        label: `${anioSeleccionado - 1} (año anterior)`,
        data: datosAnioAnterior,
        borderColor: COLOR_ANTERIOR,
        backgroundColor: COLOR_ANTERIOR,
        pointBackgroundColor: COLOR_ANTERIOR,
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0.25,
      },
    ],
  };

  const options = opcionesGrafico();

  const totalRecaudaciones = datosAnuales.reduce((total, valor) => total + (valor || 0), 0);
  const totalRecaudacionesAnterior = datosAnioAnterior.reduce((total, valor) => total + (valor || 0), 0);
  const diferencia = totalRecaudaciones - totalRecaudacionesAnterior;
  const porcentajeCrecimiento = totalRecaudacionesAnterior !== 0 
    ? ((diferencia / totalRecaudacionesAnterior) * 100).toFixed(2) 
    : "N/A";

  return (
    <>
      <Header />
      <div className="pt-5 pb-5">
        <div className="container my-5 pt-5 pb-5 mb-5 panel rounded">
        <div className="text-center mb-4">
          <h1>Recaudación anual</h1>
          <label htmlFor="anio" className="">Seleccione el año: </label>
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
                <Line data={data} options={options} />
              </div>
              <div className="col-lg-4">
                <div className="panel p-4 rounded">
                  <h3 className="mb-3">Resumen anual</h3>
                  <p><strong>Año seleccionado:</strong> {anioSeleccionado}</p>
                  <p><strong>Total recaudado en {anioSeleccionado}:</strong> {formatearMoneda(totalRecaudaciones)}</p>
                  <p><strong>Total recaudado en {anioSeleccionado - 1}:</strong> {formatearMoneda(totalRecaudacionesAnterior)}</p>
                  {totalRecaudacionesAnterior !== 0 && (
                    <p>
                      <strong>Diferencia respecto al año anterior:</strong> 
                      {diferencia >= 0 ? ` +${formatearMoneda(diferencia)}` : ` -${formatearMoneda(Math.abs(diferencia))}`}
                    </p>
                  )}
                  <p>
                    <strong>Porcentaje de crecimiento:</strong> {porcentajeCrecimiento !== "N/A" ? `${porcentajeCrecimiento}%` : "No disponible"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla de recaudaciones debajo de la gráfica */}
            <div className="mt-4">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Recaudación</th>
                  </tr>
                </thead>
                <tbody>
                  {meses.map((mes, index) => (
                    <tr key={index}>
                      <td>{mes}</td>
                      <td>{datosAnuales[index] ? formatearMoneda(datosAnuales[index]) : formatearMoneda(0)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>{formatearMoneda(totalRecaudaciones)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Información al final en dispositivos pequeños */}
            <div className="d-lg-none panel p-4 rounded mt-4">
              <h3 className="mb-3">Resumen anual</h3>
              <p><strong>Año seleccionado:</strong> {anioSeleccionado}</p>
              <p><strong>Total recaudado en {anioSeleccionado}:</strong> {formatearMoneda(totalRecaudaciones)}</p>
              <p><strong>Total recaudado en {anioSeleccionado - 1}:</strong> {formatearMoneda(totalRecaudacionesAnterior)}</p>
              <p><strong>Porcentaje de crecimiento:</strong> {porcentajeCrecimiento !== "N/A" ? `${porcentajeCrecimiento}%` : "No disponible"}</p>
            </div>
          </>
        )}
      </div>
      </div>
      
      <Footer />
    </>
  );
};

export default VerRecaudacionesAnuales;
