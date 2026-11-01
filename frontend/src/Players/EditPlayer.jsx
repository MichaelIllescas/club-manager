import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";

const EditPlayer = ({ playerId, onClose, onUpdate }) => {
  const [player, setPlayer] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    email: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playerResponse, categoriesResponse] = await Promise.all([
          apiClient.get(`/api/players/${playerId}`),
          apiClient.get("/api/categories"),
        ]);

        setPlayer({
          ...playerResponse.data,
          category: playerResponse.data.category.name,
        });
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer({ ...player, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiClient
      .put(`/api/players/${playerId}`, player)
      .then(() => {
        onUpdate();
        onClose();
      })
      .catch((error) =>
        console.error("Error al actualizar el jugador:", error)
      );
  };

  if (loading) {
    return <p>Cargando datos...</p>;
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
            <h5 className="modal-title">Editar jugador</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={player.firstName}
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
                  value={player.lastName}
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
                  value={player.dni}
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
                  value={player.phone}
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
                  value={player.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Categoría:</label>
                <select
                  name="category"
                  className="form-select"
                  value={player.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
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

EditPlayer.propTypes = {
  playerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditPlayer;
