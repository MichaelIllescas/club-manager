import PaginaAlta, { ListaRemota } from "../Components/PaginaAlta";
import { formatearMoneda } from "../Utils/formatearMoneda";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
const ActualizarCuotas = () => {
  const [recarga, setRecarga] = useState(0);
  const [feeTypes, setFeeTypes] = useState([]); // Tipos de cuotas desde el backend
  const [selectedFeeType, setSelectedFeeType] = useState(null); // Tipo de cuota seleccionado
  const [formData, setFormData] = useState({ type: "", amount: "" }); // Datos del formulario
  const [message, setMessage] = useState(null); // Mensaje de éxito o error
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error al cargar los datos

  // Cargar tipos de cuotas desde el backend
  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const response = await apiClient.get("/api/cuotas");
        setFeeTypes(response.data);
      } catch (err) {
        console.error("Error al cargar los tipos de cuotas:", err);
        setError(
          "No se pudieron cargar los tipos de cuotas. Intente nuevamente.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeeTypes();
  }, []);

  // Manejar cambios en el tipo de cuota seleccionado
  const handleSelectChange = (e) => {
    const feeTypeId = e.target.value;
    const selected = feeTypes.find(
      (feeType) => feeType.id === parseInt(feeTypeId, 10),
    );
    setSelectedFeeType(selected);
    setFormData({ type: selected.tipo, amount: selected.monto });
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar los cambios al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFeeType) {
      setMessage({
        text: "Por favor, selecciona un tipo de cuota.",
        type: "error",
      });
      return;
    }

    try {
      const updatedFee = {
        tipo: formData.type,
        monto: parseFloat(formData.amount),
      };

      await apiClient.put(`/api/cuotas/${selectedFeeType.id}`, updatedFee);

      setMessage({
        text: "Tipo de cuota actualizado con éxito.",
        type: "success",
      });
      setRecarga((n) => n + 1);

      // Actualizar la lista de cuotas en el estado
      setFeeTypes((prevFeeTypes) =>
        prevFeeTypes.map((fee) =>
          fee.id === selectedFeeType.id
            ? { ...fee, tipo: formData.type, monto: formData.amount }
            : fee,
        ),
      );

      setSelectedFeeType(null); // Limpiar selección
      setFormData({ type: "", amount: "" }); // Limpiar formulario
    } catch (err) {
      console.error("Error al actualizar el tipo de cuota:", err);
      setMessage({
        text: "Error al actualizar el tipo de cuota. Intente nuevamente.",
        type: "error",
      });
    }
  };

  return (
    <>
      <PaginaAlta
        titulo="Actualizar montos"
        intro="Elegí la cuota y cargá el nuevo monto. Los pagos ya registrados conservan el monto con el que se cobraron."
        lateral={
          <ListaRemota
            url="/api/cuotas"
            titulo="Montos actuales"
            vacio="Todavía no hay cuotas registradas."
            recarga={recarga}
            mapear={(c) => ({
              id: c.id,
              nombre: c.tipo,
              detalle: null,
              valor: formatearMoneda(c.monto),
            })}
          />
        }
      >
        {loading ? (
          <p className="text-center">Cargando tipos de cuotas...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Selección del tipo de cuota */}
            <div className="mb-3">
              <label htmlFor="feeTypeSelect" className="form-label">
                Selecciona un tipo de cuota
              </label>
              <select
                id="feeTypeSelect"
                className="form-select"
                onChange={handleSelectChange}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  -- Selecciona --
                </option>
                {feeTypes.map((feeType) => (
                  <option key={feeType.id} value={feeType.id}>
                    {feeType.tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Mostrar datos actuales */}
            {selectedFeeType && (
              <div className="mb-3">
                <p>
                  <strong>Tipo actual:</strong> {selectedFeeType.tipo}
                </p>
                <p>
                  <strong>Monto actual:</strong> $
                  {selectedFeeType.monto.toFixed(2)}
                </p>
              </div>
            )}

            {/* Formulario para editar */}
            {selectedFeeType && (
              <>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Nuevo monto
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </>
            )}

            {/* Mensaje de confirmación o error */}
            {message && (
              <p
                className={`fw-bold text-center ${
                  message.type === "success" ? "text-success" : "text-danger"
                }`}
              >
                {message.text}
              </p>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedFeeType}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}
      </PaginaAlta>
    </>
  );
};

export default ActualizarCuotas;
