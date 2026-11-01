import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";

const EditUser = ({ userId, onClose, onUpdate }) => {
  const [user, setUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    address: "",
    email: "",
    status: "ACTIVE",
    role: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, rolesResponse] = await Promise.all([
          apiClient.get(`/api/users/${userId}`),
          apiClient.get("/auth/roles"),
        ]);

        setUser({
          ...userResponse.data,
          status: userResponse.data.status || "ACTIVE",
          role: userResponse.data.role || "",
        });
        setRoles(rolesResponse.data || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Hubo un error al cargar los datos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiClient
      .put(`/api/users/${userId}`, user)
      .then(() => {
        onUpdate();
        onClose();
      })
      .catch((err) => {
        console.error("Error al actualizar el usuario:", err);
        setError("Hubo un error al actualizar el usuario. Intente nuevamente.");
      });
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar usuario</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={user.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Apellido:</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={user.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>DNI:</label>
                <input
                  type="text"
                  name="dni"
                  className="form-control"
                  value={user.dni}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Teléfono:</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={user.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Dirección:</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={user.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Estado:</label>
                <select
                  name="status"
                  className="form-select"
                  value={user.status}
                  onChange={handleChange}
                  required
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </div>
              <div className="mb-3">
                <label>Rol:</label>
                <select
                  name="role"
                  className="form-select"
                  value={user.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un Rol</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Actualizar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

EditUser.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditUser;
