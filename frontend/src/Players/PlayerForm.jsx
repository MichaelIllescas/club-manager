import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";

const PlayerForm = ({ onRegistered }) => {
  const [player, setPlayer] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    email: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer({ ...player, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/players", {
        firstName: player.firstName,
        lastName: player.lastName,
        dni: player.dni,
        phone: player.phone,
        email: player.email,
        category: { id: player.categoryId },
      });
      setMessage("Jugador registrado con éxito");
      onRegistered?.();
      setPlayer({
        firstName: "",
        lastName: "",
        dni: "",
        phone: "",
        email: "",
        categoryId: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Ocurrió un error al registrar el jugador",
      );
    }
  };

  return (
    <div className="mt-1">
      <form onSubmit={handleSubmit} className="p-1 rounded">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-control"
              placeholder="Ingrese el nombre"
              value={player.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-control"
              placeholder="Ingrese el apellido"
              value={player.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="dni" className="form-label">
              DNI
            </label>
            <input
              type="text"
              id="dni"
              name="dni"
              className="form-control"
              placeholder="Ingrese el DNI"
              value={player.dni}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control"
              placeholder="Ingrese el teléfono"
              value={player.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Ingrese el correo electrónico"
              value={player.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 d-flex flex-column">
            <label htmlFor="categoryId" className="form-label">
              Categoría
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="form-control form-select w-75 m-auto"
              value={player.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">
            Registrar
          </button>
        </div>
        {message && (
          <div className="alert alert-info text-center mt-3">{message}</div>
        )}
      </form>
    </div>
  );
};

PlayerForm.propTypes = {
  onRegistered: PropTypes.func,
};

export default PlayerForm;
