import PaginaAlta, { ListaRemota } from "../Components/PaginaAlta";
import { useState } from "react";
import apiClient from "../Config/axiosConfig";

const RegistrarSocio = () => {
  const [recarga, setRecarga] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    direccion: "",
    telefono: "",
    email: "",
    numeroSocio: "",
  });

  const [message, setMessage] = useState(null); // Mensaje de éxito o error

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpia los valores antes de enviar
    const cleanedFormData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      dni: formData.dni.trim(),
      direccion: formData.direccion.trim(),
      telefono: formData.telefono.trim(),
      email: formData.email.trim() || null,
      numeroSocio: formData.numeroSocio.trim() || null,
      estado: "ACTIVO",
    };

    // Validación básica
    const { nombre, apellido, dni, direccion, telefono } = cleanedFormData;
    if (!nombre || !apellido || !dni || !direccion || !telefono) {
      setMessage({
        text: "Por favor, completa todos los campos obligatorios.",
        type: "error",
      });
      return;
    }

    try {
      await apiClient.post("/api/socios", cleanedFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage({
        text: "Socio registrado con éxito.",
        type: "success",
      });
      setRecarga((n) => n + 1);

      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        direccion: "",
        telefono: "",
        email: "",
        numeroSocio: "",
      });
    } catch (error) {
      if (error.response) {
        const serverMessage =
          error.response.data.message || "Error desconocido en el servidor.";
        setMessage({
          text: `Error del servidor: ${serverMessage}`,
          type: "error",
        });
      } else {
        setMessage({
          text: "No se pudo conectar con el servidor.",
          type: "error",
        });
      }
    }
  };

  return (
    <>
      <PaginaAlta
        titulo="Registrar socio"
        intro="Cargá los datos de la persona que se asocia al club. El DNI y el número de socio no se pueden repetir."
        lateral={
          <ListaRemota
            url="/api/socios"
            titulo="Últimos socios"
            vacio="Todavía no hay socios. El primero que registres aparece acá."
            recarga={recarga}
            mapear={(socio) => ({
              id: socio.id,
              nombre: `${socio.nombre} ${socio.apellido}`,
              detalle: `DNI ${socio.dni}`,
              valor: socio.numeroSocio ? `N° ${socio.numeroSocio}` : null,
            })}
          />
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="apellido" className="form-label">
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="form-control"
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
                value={formData.dni}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="direccion" className="form-label">
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="telefono" className="form-label">
                Teléfono
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="form-control"
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
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="numeroSocio" className="form-label">
                Número de socio (Optional)
              </label>
              <input
                type="text"
                id="numeroSocio"
                name="numeroSocio"
                value={formData.numeroSocio}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            {message && (
              <p
                className={`fw-bold text-center mt-4 ${
                  message.type === "success" ? "text-success" : "text-danger"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="text-center mt-3">
              <button type="submit" className="btn btn-primary">
                Registrar Socio
              </button>
            </div>
          </div>
        </form>
      </PaginaAlta>
    </>
  );
};

export default RegistrarSocio;
