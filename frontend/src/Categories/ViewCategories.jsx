import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import TableGeneric from "../Components/TableGeneric";
import SummaryStrip from "../Components/SummaryStrip";
import apiClient from "../Config/axiosConfig";
import { useSession } from "../Auth/useSession";

const ViewCategory = () => {
  const { role } = useSession();
  const [categories, setCategories] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, playersResponse] = await Promise.all([
          apiClient.get("/api/categories"),
          apiClient.get("/api/players").catch(() => ({ data: [] })),
        ]);
        setCategories(categoriesResponse.data);
        setPlayers(Array.isArray(playersResponse.data) ? playersResponse.data : []);
      } catch (err) {
        console.error("Error al obtener las categorías:", err);
        setError("No se pudieron cargar las categorías. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Active players in each category
  const active = players.filter((player) => player.status === "ACTIVE");
  const rows = categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description || "Sin descripción",
    players: active.filter((player) => player.category === category.name).length,
  }));

  const largestCategory = rows.reduce((max, row) => (row.players > (max?.players ?? 0) ? row : max), null);

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
            <SummaryStrip
              data={[
                { label: "Categorías", value: categories.length },
                { label: "Jugadores activos", value: active.length },
                {
                  label: largestCategory
                    ? `La más numerosa (${largestCategory.players} jugadores)`
                    : "La más numerosa",
                  value: largestCategory ? largestCategory.name : "—",
                },
              ]}
            />
            <TableGeneric
              columns={["id", "name", "description", "players"]}
              emptyMessage="Todavía no hay categorías registradas."
              title="Categorías"
              data={rows}
              primaryAction={
                role === "ADMIN" && (
                  <Link to="/categorias/nueva" className="btn btn-primary">
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

export default ViewCategory;
