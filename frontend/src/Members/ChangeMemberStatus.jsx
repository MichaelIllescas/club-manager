import { useState, useEffect } from "react";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import TableGeneric from "../Components/TableGeneric";
import apiClient from "../Config/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

// Text shown to the user for each action
const ACTION_LABELS = { deactivate: "anular", activate: "habilitar" };

const ChangeMemberStatus = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");

  const fetchMembers = async () => {
    try {
      const response = await apiClient.get("/api/members");
      setMembers(response.data);
    } catch (err) {
      console.error("Error al obtener los socios:", err);
      setError("No se pudieron cargar los socios. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleActionClick = (member, actionType) => {
    setSelectedMember(member);
    setAction(actionType);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      const endpoint =
        action === "deactivate"
          ? `/api/members/${selectedMember.id}/deactivate`
          : `/api/members/${selectedMember.id}/activate`;

      await apiClient.put(endpoint);
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      console.error(`Error al ${ACTION_LABELS[action]} el socio:`, err);
      setError(`No se pudo ${ACTION_LABELS[action]} el socio. Intente nuevamente.`);
    }
  };

  const membersWithActions = members.map((member) => ({
    ...member,
    actions: (
      <button
        className={`btn ${
          member.status === "ACTIVE" ? "btn-danger" : "btn-success"
        } me-2`}
        onClick={() =>
          handleActionClick(
            member,
            member.status === "ACTIVE" ? "deactivate" : "activate",
          )
        }
      >
        {member.status === "ACTIVE" ? "Anular" : "Habilitar"}
      </button>
    ),
  }));

  return (
    <>
      <Header />
      <div className="pt-2 mt-2 vh-50 pb-5">
        <div className="d-flex justify-content-center align-content-center pb-5 mb-2">
          <div className="mt-5 col-lg-12 text-center">
            {loading ? (
              <p className="text-center">Cargando socios...</p>
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
                  "memberNumber",
                  "registrationDate",
                  "address",
                  "status",
                  "actions",
                ]}
                emptyMessage="Todavía no hay socios registrados."
                title={"Estado de los socios"}
                data={membersWithActions}
              />
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Acción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres {ACTION_LABELS[action]} a {selectedMember?.firstName}?
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

export default ChangeMemberStatus;
