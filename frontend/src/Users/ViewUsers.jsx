import { useState, useEffect } from "react";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import TableGeneric from "../Components/TableGeneric";
import apiClient from "../Config/axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import EditUser from "./EditUser";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userIdToReset, setUserIdToReset] = useState(null);
  const [resetMessage, setResetMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error al obtener los usuarios:", err);
      setError("No se pudieron cargar los usuarios. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await apiClient.post(`/api/users/${userId}/reset-password`);
      setIsSuccess(true);
      setResetMessage("Clave reseteada con éxito.");
      fetchUsers();
    } catch (err) {
      console.error("Error al resetear la clave:", err);
      setIsSuccess(false);
      setResetMessage("Error al resetear la clave. Intente nuevamente.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openResetModal = (userId) => {
    setUserIdToReset(userId);
    setResetMessage("");
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setUserIdToReset(null);
    setShowResetModal(false);
    setResetMessage("");
  };

  return (
    <>
      <Header />
      <div className="d-flex justify-content-center align-content-center pt-1 pb-5 mb-3">
        <div className="mt-5 col-lg-10 pb-5">
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
                "phone",
                "address",
                "email",
                "status",
                "role",
              ]}
              emptyMessage="Todavía no hay usuarios registrados."
              title={"Usuarios"}
              data={users}
              actions={[
                {
                  label: "Editar",
                  className: "btn-warning",
                  onClick: (row) => setSelectedUserId(row.id),
                },
                {
                  label: "Restablecer contraseña",
                  className: "btn-info",
                  onClick: (row) => openResetModal(row.id),
                },
              ]}
            />
          )}
        </div>
      </div>

      {selectedUserId && (
        <EditUser
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUpdate={fetchUsers}
        />
      )}

      <div
        className={`modal fade ${showResetModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showResetModal ? "block" : "none" }}
        aria-labelledby="resetModalLabel"
        aria-hidden={!showResetModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="resetModalLabel">
                Confirmar reseteo de clave
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeResetModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {resetMessage && (
                <p className={`text-${isSuccess ? "success" : "danger"}`}>
                  {resetMessage}
                </p>
              )}
              {!resetMessage && (
                <p>¿Está seguro que desea resetear la clave de este usuario?</p>
              )}
            </div>
            <div className="modal-footer">
              {!resetMessage && (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeResetModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleResetPassword(userIdToReset)}
                  >
                    Confirmar
                  </button>
                </>
              )}
              {resetMessage && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeResetModal}
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ViewUsers;
