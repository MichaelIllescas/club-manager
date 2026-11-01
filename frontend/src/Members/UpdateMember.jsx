import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";

const UpdateMember = ({ memberId, onClose, onUpdate }) => {
  const [member, setMember] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    email: "",
    address: "",
    memberNumber: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await apiClient.get(`/api/members/${memberId}`);
        setMember(response.data);
      } catch (error) {
        console.error("Error al cargar los datos del socio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/api/members/${memberId}`, member);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el socio:", error);
    }
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
            <h5 className="modal-title">Actualizar socio</h5>
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
                  value={member.firstName}
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
                  value={member.lastName}
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
                  value={member.dni}
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
                  value={member.phone}
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
                  value={member.email}
                  onChange={handleChange}
                  
                />
              </div>
              <div className="mb-3">
                <label>Dirección:</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={member.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Número de socio:</label>
                <input
                  type="text"
                  name="memberNumber"
                  className="form-control"
                  value={member.memberNumber}
                  onChange={handleChange}
                  
                />
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

UpdateMember.propTypes = {
  memberId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UpdateMember;
