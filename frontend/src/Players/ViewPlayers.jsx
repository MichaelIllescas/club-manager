import { useState, useEffect } from "react";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import TableGeneric from "../Components/TableGeneric";
import EditPlayer from "./EditPlayer";
import apiClient from "../Config/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const fetchPlayers = async () => {
    try {
      const response = await apiClient.get("/api/players");

      setPlayers(response.data);
    } catch (err) {
      console.error("Error al obtener los jugadores:", err);
      setError("No se pudieron cargar los jugadores. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleEdit = (playerId) => {
    setSelectedPlayerId(playerId);
  };

  const actions = [
    {
      label: "Editar",
      className: "btn-warning",
      onClick: (row) => handleEdit(row.id),
    },
  ];

  return (
    <>
      <Header />
      <div className="d-flex justify-content-center align-content-center py-5">
        <div className="mt-3 col-lg-10 px-1 mx-1 pb-5">
          {loading ? (
            <p className="text-center">Cargando jugadores...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
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
              emptyMessage="Todavía no hay jugadores registrados."
              title={"Jugadores"}
              data={players}
              actions={actions}
            />
          )}
        </div>
      </div>

      {selectedPlayerId && (
        <EditPlayer
          playerId={selectedPlayerId}
          onClose={() => setSelectedPlayerId(null)}
          onUpdate={fetchPlayers}
        />
      )}

      <Footer />
    </>
  );
};

export default ViewPlayers;
