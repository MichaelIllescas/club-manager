import { useState, useEffect } from "react";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import TableGeneric from "../Components/TableGeneric";
import apiClient from "../Config/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

// Text shown to the user for each action
const ACTION_LABELS = { deactivate: "deshabilitar", activate: "habilitar" };

const ChangePlayerStatus = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");

  const fetchPlayers = async () => {
    try {
      const response = await apiClient.get("/api/players/statuses");
      setPlayers(Array.isArray(response.data) ? response.data : []);
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

  const handleActionClick = (player, actionType) => {
    setSelectedPlayer(player);
    setAction(actionType);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      const endpoint =
        action === "deactivate"
          ? `/api/players/${selectedPlayer.id}/deactivate`
          : `/api/players/${selectedPlayer.id}/activate`;

      await apiClient.put(endpoint);
      setShowModal(false);
      fetchPlayers();
    } catch (err) {
      console.error(`Error al ${ACTION_LABELS[action]} el jugador:`, err);
      setError(`No se pudo ${ACTION_LABELS[action]} el jugador. Intente nuevamente.`);
    }
  };

  const playersWithActions = players.map((player) => ({
    ...player,
    actions: (
      <button
        className={`btn ${
          player.status == "ACTIVE" ? "btn-danger" : "btn-success"
        } me-2`}
        onClick={() =>
          handleActionClick(
            player,
            player.status == "ACTIVE" ? "deactivate" : "activate",
          )
        }
      >
        {player.status == "ACTIVE" ? "Deshabilitar" : "Habilitar"}
      </button>
    ),
  }));

  return (
    <>
      <Header />
      <div className="d-flex justify-content-center align-content-center py-5">
        <div className="mt-3 col-lg-10 pb-5 mb-3 px-1">
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
                "status",
                "actions",
              ]}
              emptyMessage="Todavía no hay jugadores registrados."
              title={"Estado de los jugadores"}
              data={playersWithActions}
            />
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Acción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres {ACTION_LABELS[action]} a {selectedPlayer?.firstName}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant={action === "deactivate" ? "danger" : "success"}
            onClick={handleConfirmAction}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default ChangePlayerStatus;
