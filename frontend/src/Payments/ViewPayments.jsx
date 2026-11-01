import { useState, useEffect } from "react";
import Footer from "../Index/Footer";
import Header from "../Navbar/Header";
import TableGeneric from "../Components/TableGeneric";
import apiClient from "../Config/axiosConfig";
import DescargarComprobante from "../Components/ComprobantePagoPDF";

const VerListadoGeneralPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  // El backend solo completa `categoria` en pagos de jugadores; en los de socios viene vacía
  const esPagoDeJugador = (pago) => Boolean(pago.categoria?.trim());

  const pagosFiltrados =
    tipoFiltro === "todos"
      ? pagos
      : pagos.filter(
          (pago) => esPagoDeJugador(pago) === (tipoFiltro === "jugador"),
        );

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await apiClient.get("/api/pagos/listadoGeneralPagos");

        // Formatear fechas y agregar la columna con el botón de descarga
        // Del más nuevo al más viejo (se ordena antes de formatear la fecha)
        const ordenados = [...response.data].sort(
          (a, b) =>
            new Date(b.fechaPago) - new Date(a.fechaPago) ||
            (b.id ?? 0) - (a.id ?? 0),
        );

        const formattedPagos = ordenados.map((cuota) => ({
          ...cuota,
          fechaPago: formatDate(cuota.fechaPago),
          Comprobante: <DescargarComprobante pago={cuota} />, // Agregamos el botón aquí
        }));

        setPagos(formattedPagos);
      } catch (err) {
        console.error("Error al obtener los pagos:", err);
        setError("No se pudieron cargar los pagos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-content-center py-2">
        <div className="mt-3 py-5 mb-5 pb-5">
          {loading ? (
            <p className="text-center">Cargando cuotas...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
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
              mensajeVacio="Todavía no hay pagos registrados."
              key={tipoFiltro}
              titulo={"Pagos registrados"}
              data={pagosFiltrados} // 🔥 Ahora los datos incluyen el botón sin modificar TableGeneric
              filtros={
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">Pagos de:</h5>
                  <select
                    id="tipoFiltro"
                    className="form-select w-auto"
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="jugador">Jugadores</option>
                    <option value="socio">Socios</option>
                  </select>
                </div>
              }
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VerListadoGeneralPagos;
