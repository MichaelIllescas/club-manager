import FormPage, { RemoteList } from "../Components/FormPage";
import { useState } from "react";
import apiClient from "../Config/axiosConfig";

const RegisterMember = () => {
  const [reload, setReload] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    address: "",
    phone: "",
    email: "",
    memberNumber: "",
  });

  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedFormData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dni: formData.dni.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      memberNumber: formData.memberNumber.trim() || null,
      status: "ACTIVE",
    };

    const { firstName, lastName, dni, address, phone } = cleanedFormData;
    if (!firstName || !lastName || !dni || !address || !phone) {
      setMessage({
        text: "Por favor, completa todos los campos obligatorios.",
        type: "error",
      });
      return;
    }

    try {
      await apiClient.post("/api/members", cleanedFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage({
        text: "Socio registrado con éxito.",
        type: "success",
      });
      setReload((n) => n + 1);

      setFormData({
        firstName: "",
        lastName: "",
        dni: "",
        address: "",
        phone: "",
        email: "",
        memberNumber: "",
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
      <FormPage
        title="Registrar socio"
        intro="Cargá los datos de la persona que se asocia al club. El DNI y el número de socio no se pueden repetir."
        side={
          <RemoteList
            url="/api/socios"
            title="Últimos socios"
            empty="Todavía no hay socios. El primero que registres aparece acá."
            reload={reload}
            toItem={(member) => ({
              id: member.id,
              name: `${member.firstName} ${member.lastName}`,
              detail: `DNI ${member.dni}`,
              value: member.memberNumber ? `N° ${member.memberNumber}` : null,
            })}
          />
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-control"
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
                value={formData.lastName}
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
              <label htmlFor="address" className="form-label">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-control"
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
                value={formData.phone}
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
              <label htmlFor="memberNumber" className="form-label">
                Número de socio (Optional)
              </label>
              <input
                type="text"
                id="memberNumber"
                name="memberNumber"
                value={formData.memberNumber}
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
      </FormPage>
    </>
  );
};

export default RegisterMember;
