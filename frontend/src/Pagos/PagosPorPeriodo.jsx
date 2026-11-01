import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import TableGeneric from "../Components/TableGeneric";
import Header from "../Navbar/Header";
import Footer from "../Index/Footer";
import DescargarComprobante from "../Components/ComprobantePagoPDF";

const VerPagosPorPeriodo = () => {
  const [diaSeleccionado, setDiaSeleccionado] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [añoSeleccionado, setAñoSeleccionado] = useState("");
  const [pagos, setPagos] = useState([]);
  const [pagosConBoton, setPagosConBoton] = useState([]); // Estado con la columna agregada
  const [loading, setLoading] = useState(false);

  // Función para obtener los pagos según los filtros seleccionados
  const fetchPagos = async () => {
    setLoading(true);
    try {
      let url = "/api/pagos/por-periodo?";
      if (añoSeleccionado) url += `año=${añoSeleccionado}&`;
      if (mesSeleccionado) url += `mes=${mesSeleccionado}&`;
      if (diaSeleccionado) url += `dia=${diaSeleccionado}`;

      url = url.endsWith("&") ? url.slice(0, -1) : url; // Eliminar el último "&" si queda

      const response = await apiClient.get(url);
      setPagos(response.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Actualiza la lista de pagos automáticamente cuando cambian los filtros
  useEffect(() => {
    fetchPagos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaSeleccionado, mesSeleccionado, añoSeleccionado]);

  // Agregar la columna de "Descargar Comprobante" después de recibir los datos
  useEffect(() => {
    if (pagos.length > 0) {
      const pagosConDescarga = pagos.map((pago) => ({
        ...pago,
        Comprobante: <DescargarComprobante pago={pago} />,
      }));
      setPagosConBoton(pagosConDescarga);
    }
  }, [pagos]);

  return (
    <>
      <Header />
      <div className="pt-3 pb-3">
        <div className="container my-5 py-5">
          <div className="panel p-4 rounded">
            <h2>Historial de pagos por fecha</h2>

            {/* Selector de Año */}
            <div className="mb-3">
              <label className="form-label">Seleccionar año:</label>
              <select
                className="form-select w-100"
                value={añoSeleccionado}
                onChange={(e) => setAñoSeleccionado(e.target.value)}
              >
                <option value="">Todos los años</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={2025 + i} value={2025 + i}>
                    {2025 + i}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Mes */}
            <div className="mb-3">
              <label className="form-label">Seleccionar mes:</label>
              <select
                className="form-select w-100"
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(e.target.value)}
              >
                <option value="">Todos los meses</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("es", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Día */}
            <div className="mb-3">
              <label className="form-label">Seleccionar día:</label>
              <select
                className="form-select w-100"
                value={diaSeleccionado}
                onChange={(e) => setDiaSeleccionado(e.target.value)}
              >
                <option value="">Todos los días</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de Pagos */}
            {loading ? (
              <p>Cargando pagos...</p>
            ) : (
              <TableGeneric
                columnas={[
                  "id",
                  "nombre",
                  "apellido",
                  "dni",
                  "categoria",
                  "fechaPago",
                  "monto",
                  "descripcion",
                  "tipo",
                  "usuario_registro",
                  "Comprobante",
                ]}
                mensajeVacio="No hay pagos en el período elegido."
                titulo="Pagos encontrados"
                data={pagosConBoton} // 🔥 Ahora los datos incluyen el botón de descarga
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VerPagosPorPeriodo;
