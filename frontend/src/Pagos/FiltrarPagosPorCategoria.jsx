import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import TableGeneric from "../Components/TableGeneric";
import Header from "../Navbar/Header";
import Footer from "../Index/Footer";

const FiltrarPagosPorCategoria = () => {
  const [categorias, setCategorias] = useState([]); // Lista de categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(""); // ID de la categoría seleccionada
  const [mesSeleccionado, setMesSeleccionado] = useState(""); // Mes seleccionado
  const [añoSeleccionado, setAñoSeleccionado] = useState(""); // Año seleccionado
  const [pagosFiltrados, setPagosFiltrados] = useState([]); // Lista de pagos filtrados
  const [loading, setLoading] = useState(false); // Indicador de carga

  // Obtener categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await apiClient.get("/api/categorias");
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Filtrar pagos por categoría, mes y año seleccionados
  // Actualizar el listado cuando cambian los filtros
  useEffect(() => {
    const fetchPagosFiltrados = async () => {
      setLoading(true);
      try {
        // axios arma la URL y omite los filtros vacíos
        const response = await apiClient.get("/api/pagos/estado-pagos", {
          params: {
            categoriaId: categoriaSeleccionada || undefined,
            mes: mesSeleccionado || undefined,
            año: añoSeleccionado || undefined,
          },
        });
        setPagosFiltrados(response.data);
      } catch (error) {
        console.error("Error al filtrar pagos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPagosFiltrados();
  }, [categoriaSeleccionada, mesSeleccionado, añoSeleccionado]);

  return (
    <>
      <Header />
      <div className="pt-3">
        <div className="container my-5 py-5">
          <div className="panel p-4 rounded">
            <h2>Filtrar pagos</h2>
            <div className="mb-3">
              <label className="form-label">Seleccionar categoría:</label>
              <select
                className="form-select w-100"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Seleccionar mes:</label>
              <select
                className="form-select w-100"
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona un meses
                </option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("es", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Seleccionar año:</label>
              <select
                className="form-select w-100"
                value={añoSeleccionado}
                onChange={(e) => setAñoSeleccionado(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona el año
                </option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = 2025 + i; // Comenzar desde 2025
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {loading ? (
              <p>Cargando pagos...</p>
            ) : (
              <TableGeneric
                columnas={["nombre", "apellido", "dni", "estado"]}
                mensajeVacio="No hay pagos para los filtros elegidos."
                titulo="Pagos encontrados"
                data={pagosFiltrados}
                actions={[]}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FiltrarPagosPorCategoria;
