import FormPage, { RemoteList } from "../Components/FormPage";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import "../Users/RegisterUser.css";

const RegisterUser = () => {
  const [reload, setReload] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiClient.get("auth/roles");
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          console.error("El formato de roles no es un array.");
        }
      } catch (err) {
        console.error("Error al cargar los roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    console.log("Datos enviados al backend:", formData);

    try {
      await apiClient.post("/auth/register", formData);
      setSuccess("Usuario registrado exitosamente.");
      setReload((n) => n + 1);
      setFormData({
        firstName: "",
        lastName: "",
        dni: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        role: "USER",
      });
    } catch (err) {
      setError("Hubo un error al registrar el usuario. Intenta nuevamente.");
      console.error(err);
    }
  };

  return (
    <>
      <FormPage
        title="Registrar usuario"
        intro="Los usuarios son las personas que usan el sistema. El rol administrador puede además gestionar cuotas, categorías, usuarios y ver las recaudaciones."
        side={
          <RemoteList
            url="/api/users/getAllUsers"
            title="Usuarios del sistema"
            empty="Todavía no hay otros usuarios."
            reload={reload}
            toItem={(user) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              detail: user.email,
              value: user.role === "ADMIN" ? "Administrador" : "Usuario",
            })}
          />
        }
      >
        <form onSubmit={handleSubmit} className="panel p-4 rounded">
          <h1 className="text-center mb-4">Registrar usuario</h1>

          <div className="d-flex flex-column gap-4">
            <div className="d-flex flex-wrap gap-3">
              <div className="flex-fill">
                <label htmlFor="firstName" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex-fill">
                <label htmlFor="lastName" className="form-label">
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <div className="flex-fill">
                <label htmlFor="dni" className="form-label">
                  DNI
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  className="form-control"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex-fill">
                <label htmlFor="phone" className="form-label">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <div className="flex-fill">
                <label htmlFor="address" className="form-label">
                  Dirección
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex-fill">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 align-items-center">
              <div className="flex-fill">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex-fill role-container">
                <label htmlFor="role" className="form-label">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  className="form-select m-auto"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{ width: "290px" }}
                >
                  <option value="" disabled>
                    Seleccionar Rol
                  </option>
                  {roles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-danger text-center">{error}</p>}
          {success && <p className="text-success text-center">{success}</p>}
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
          </div>
        </form>
      </FormPage>
    </>
  );
};

export default RegisterUser;
