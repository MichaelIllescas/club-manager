import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../index/Footer";
import TableGeneric from "/src/Components/TableGeneric";
import ResumenLista from "../Components/ResumenLista";
import apiClient from "../Config/axiosConfig";
import { useSession } from "../Auth/useSession";

const VerCategoria = () => {
  const { rol } = useSession();
  const [categorias, setCategorias] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [respuestaCategorias, respuestaJugadores] = await Promise.all([
          apiClient.get("/api/categorias"),
          apiClient.get("/api/jugadores").catch(() => ({ data: [] })),
        ]);
        setCategorias(respuestaCategorias.data);
        setJugadores(Array.isArray(respuestaJugadores.data) ? respuestaJugadores.data : []);
      } catch (err) {
        console.error("Error al obtener las categorías:", err);
        setError("No se pudieron cargar las categorías. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  // Jugadores activos de cada categoría
  const activos = jugadores.filter((jugador) => jugador.estado === "ACTIVO");
  const filas = categorias.map((categoria) => ({
    id: categoria.id,
    nombre: categoria.nombre,
    descripcion: categoria.descripcion || "Sin descripción",
    jugadores: activos.filter((jugador) => jugador.categoria === categoria.nombre).length,
  }));

  const masJugadores = filas.reduce((max, fila) => (fila.jugadores > (max?.jugadores ?? 0) ? fila : max), null);

  return (
    <>
      <Header />
      <main className="container pb-5">
        {loading ? (
          <p className="mt-4">Cargando categorías...</p>
        ) : error ? (
          <div className="alert alert-danger mt-4">{error}</div>
        ) : (
          <>
            <ResumenLista
              datos={[
                { nombre: "Categorías", valor: categorias.length },
                { nombre: "Jugadores activos", valor: activos.length },
                {
                  nombre: masJugadores
                    ? `La más numerosa (${masJugadores.jugadores} jugadores)`
                    : "La más numerosa",
                  valor: masJugadores ? masJugadores.nombre : "—",
                },
              ]}
            />
            <TableGeneric
              columnas={["id", "nombre", "descripcion", "jugadores"]}
              mensajeVacio="Todavía no hay categorías registradas."
              titulo="Categorías"
              data={filas}
              accionPrincipal={
                rol === "ADMIN" && (
                  <Link to="/RegistarCategoria" className="btn btn-primary">
                    <i className="fas fa-plus me-2" aria-hidden="true"></i>Nueva categoría
                  </Link>
                )
              }
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default VerCategoria;
