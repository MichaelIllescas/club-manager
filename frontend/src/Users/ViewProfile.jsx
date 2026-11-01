import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormPage, { SideNote } from "../Components/FormPage";

const ViewProfile = () => {
  const [user, setUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    address: "",
    email: "",
    status: "activo",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get("/api/users/me");
        setUser(response.data);
      } catch (err) {
        console.error("Error al obtener los datos del usuario:", err);
        setError("No se pudieron cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/api/users/${user.id}`, user);
      setShowModal(false);
    } catch (err) {
      console.error("Error al actualizar los datos:", err);
      setError("No se pudieron actualizar los datos. Intente nuevamente.");
    }
  };

  return (
    <>
      <FormPage
        title="Mi perfil"
        intro="Tus datos en el sistema. El email es el que usás para ingresar."
        side={
          <SideNote title="Tu cuenta">
            <p className="mb-2">
              Rol:{" "}
              <strong>
                {user.role === "ADMIN" ? "Administrador" : "Usuario"}
              </strong>
            </p>
            <p className="mb-3">
              {user.role === "ADMIN"
                ? "Podés gestionar cuotas, categorías, usuarios y ver las recaudaciones."
                : "Podés registrar socios, jugadores y pagos, y consultar los listados."}
            </p>
            <Link to="/perfil/clave" className="btn btn-secondary">
              <i className="fas fa-key me-2" aria-hidden="true"></i>Cambiar
              contraseña
            </Link>
          </SideNote>
        }
      >
        {loading ? (
          <p>Cargando datos...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <dl className="profile-list">
              <dt>Nombre</dt>
              <dd>
                {user.firstName} {user.lastName}
              </dd>
              <dt>DNI</dt>
              <dd>{user.dni || "Sin cargar"}</dd>
              <dt>Email</dt>
              <dd>{user.email || "Sin cargar"}</dd>
              <dt>Teléfono</dt>
              <dd>{user.phone || "Sin cargar"}</dd>
              <dt>Dirección</dt>
              <dd>{user.address || "Sin cargar"}</dd>
            </dl>
            <div className="form-page__actions">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <i className="fas fa-user-edit me-2" aria-hidden="true"></i>
                Editar mis datos
              </Button>
            </div>
          </>
        )}
      </FormPage>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={user.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                name="dni"
                value={user.dni}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewProfile;
