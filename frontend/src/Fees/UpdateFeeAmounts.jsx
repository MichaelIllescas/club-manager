import FormPage, { RemoteList } from "../Components/FormPage";
import { formatCurrency } from "../Utils/formatCurrency";
import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
const UpdateFees = () => {
  const [reload, setReload] = useState(0);
  const [feeTypes, setFeeTypes] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [formData, setFormData] = useState({ name: "", amount: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const response = await apiClient.get("/api/fees");
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

  const handleSelectChange = (e) => {
    const feeTypeId = e.target.value;
    const selected = feeTypes.find(
      (feeType) => feeType.id === parseInt(feeTypeId, 10),
    );
    setSelectedFeeType(selected);
    setFormData({ name: selected.name, amount: selected.amount });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        name: formData.name,
        amount: parseFloat(formData.amount),
      };

      await apiClient.put(`/api/fees/${selectedFeeType.id}`, updatedFee);

      setMessage({
        text: "Tipo de cuota actualizado con éxito.",
        type: "success",
      });
      setReload((n) => n + 1);

      setFeeTypes((prevFeeTypes) =>
        prevFeeTypes.map((fee) =>
          fee.id === selectedFeeType.id
            ? { ...fee, name: formData.name, amount: formData.amount }
            : fee,
        ),
      );

      setSelectedFeeType(null);
      setFormData({ name: "", amount: "" });
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
      <FormPage
        title="Actualizar montos"
        intro="Elegí la cuota y cargá el nuevo monto. Los pagos ya registrados conservan el monto con el que se cobraron."
        side={
          <RemoteList
            url="/api/cuotas"
            title="Montos actuales"
            empty="Todavía no hay cuotas registradas."
            reload={reload}
            toItem={(c) => ({
              id: c.id,
              name: c.name,
              detail: null,
              value: formatCurrency(c.amount),
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
                    {feeType.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedFeeType && (
              <div className="mb-3">
                <p>
                  <strong>Tipo actual:</strong> {selectedFeeType.name}
                </p>
                <p>
                  <strong>Monto actual:</strong> $
                  {selectedFeeType.amount.toFixed(2)}
                </p>
              </div>
            )}

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
      </FormPage>
    </>
  );
};

export default UpdateFees;
