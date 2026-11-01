import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import TableGeneric from "../Components/TableGeneric";

const PlayersByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setPlayers([]);
      return;
    }

    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/players/category/${selectedCategory}`);
        setPlayers(response.data);
      } catch (error) {
        console.error("Error al filtrar jugadores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedCategory]);

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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p>Cargando jugadores...</p>
            ) : (
              <TableGeneric
                columns={[
                  "id",
                  "firstName",
                  "lastName",
                  "dni",
                  "phone",
                  "email",
                  "registrationDate",
                  "category",
                  "status",
                ]}
                emptyMessage="No hay jugadores en esta categoría."
                title="Jugadores"
                data={players}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PlayersByCategory;
