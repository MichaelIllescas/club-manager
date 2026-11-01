import { useState, useEffect } from "react";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import TableGeneric from "../Components/TableGeneric";
import apiClient from "../Config/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

// Text shown to the user for each action
const ACTION_LABELS = { deactivate: "anular", activate: "habilitar" };

const ChangeUserStatus = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/api/users/statuses");
      setUsers(response.data);
    } catch (err) {
      console.error("Error al obtener los usuarios:", err);
      setError("No se pudieron cargar los usuarios. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActionClick = (user, actionType) => {
    setSelectedUser(user);
    setAction(actionType);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      const endpoint =
        action === "deactivate"
          ? `/api/users/${selectedUser.id}/deactivate`
          : `/api/users/${selectedUser.id}/activate`;

      await apiClient.put(endpoint);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error(`Error al ${ACTION_LABELS[action]} el usuario:`, err);
      setError(`No se pudo ${ACTION_LABELS[action]} el usuario. Intente nuevamente.`);
    }
  };

  const usersWithActions = users.map((user) => ({
    ...user,
    actions: (
      <button
        className={`btn ${
          user.status === "ACTIVE" ? "btn-danger" : "btn-success"
        } me-2`}
        onClick={() =>
          handleActionClick(
            user,
            user.status === "ACTIVE" ? "deactivate" : "activate",
          )
        }
      >
        {user.status === "ACTIVE" ? "Anular" : "Habilitar"}
      </button>
    ),
  }));

  return (
    <>
      <Header />
      <div className="pb-5 mb-5 px-1">
        <div className="pb-5 mb-5 pt-2 mt-2 vh-50">
          <div className="d-flex justify-content-center align-content-center">
            <div className="mt-5 col-lg-12 text-center">
              {loading ? (
                <p className="text-center">Cargando usuarios...</p>
              ) : error ? (
                <p className="text-center text-danger">{error}</p>
              ) : (
                <TableGeneric
                  columns={[
                    "id",
                    "firstName",
                    "lastName",
                    "dni",
                    "email",
                    "status",
                    "actions",
                  ]}
                  emptyMessage="Todavía no hay usuarios registrados."
                  title={"Estado de los usuarios"}
                  data={usersWithActions}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Acción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres {ACTION_LABELS[action]} a {selectedUser?.firstName}?
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

export default ChangeUserStatus;
