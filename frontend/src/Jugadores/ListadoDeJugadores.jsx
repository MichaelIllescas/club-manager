import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import Header from "../Navbar/Header";
import Footer from "../Index/Footer";
import TableGeneric from "../Components/TableGeneric";

const FiltrarJugadoresPorCategoria = () => {
  const [categorias, setCategorias] = useState([]); // Lista de categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(""); // ID de la categoría seleccionada
  const [jugadores, setJugadores] = useState([]); // Lista de jugadores filtrados
  const [loading, setLoading] = useState(false); // Indicador de carga

  // Obtener categorías al cargar el componente
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

  // Filtrar jugadores por categoría seleccionada
  const fetchJugadores = async () => {
    if (!categoriaSeleccionada) {
      setJugadores([]);
      return;
    }

    setLoading(true); // Mostrar indicador de carga
    try {
      const response = await apiClient.get(
        `/api/jugadores/categoria/${categoriaSeleccionada}`,
      );
      setJugadores(response.data);
    } catch (error) {
      console.error("Error al filtrar jugadores:", error);
    } finally {
      setLoading(false); // Ocultar indicador de carga
    }
  };

  // Actualizar lista de jugadores cuando cambia la categoría seleccionada
  useEffect(() => {
    fetchJugadores();
  }, [categoriaSeleccionada]);

  return (
    <>
      <Header />
      <div className="pt-3 pb-5">
        <div className="container my-5 py-5">
          <div className="panel p-3 rounded">
            <h2>Filtrar jugadores</h2>
            <div className="mb-3">
              <label className="form-label">Seleccionar categoría:</label>
              <select
                className="form-select w-100"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p>Cargando jugadores...</p>
            ) : (
              <TableGeneric
                columnas={[
                  "id",
                  "nombre",
                  "apellido",
                  "dni",
                  "telefono",
                  "email",
                  "fechaRegistro",
                  "categoria",
                  "estado",
                ]}
                mensajeVacio="No hay jugadores en esta categoría."
                titulo="Jugadores"
                data={jugadores}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FiltrarJugadoresPorCategoria;
