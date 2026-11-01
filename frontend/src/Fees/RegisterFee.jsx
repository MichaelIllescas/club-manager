import Footer from "../Pages/Footer";
import Header from "../Navbar/Header";
import { useEffect, useState } from "react";
import apiClient from "../Config/axiosConfig";
import { formatCurrency } from "../Utils/formatCurrency";
import "../Components/FormPage.css";

const EMPTY_FORM = { name: "", amount: "" };

const RegisterFee = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState([]);
  const [lastId, setLastId] = useState(null);

  const loadFees = async () => {
    try {
      const response = await apiClient.get("/api/fees");
      setFees(response.data);
    } catch (error) {
      console.error("Error al cargar las cuotas:", error);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const duplicatedName = fees.some(
    (fee) => fee.name?.trim().toLowerCase() === formData.name.trim().toLowerCase()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiClient.post("/api/fees", {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        registrationDate: new Date().toISOString(),
      });

      setMessage({ text: `Se registró la cuota "${formData.name.trim()}".`, type: "success" });
      setLastId(response.data?.id ?? null);
      setFormData(EMPTY_FORM);
      loadFees();
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.error ||
          "No se pudo registrar la cuota. Revisá el nombre y el monto.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container form-page">
        <section className="panel form-page__panel">
          <h1 className="form-page__title">Registrar cuota</h1>
          <p className="form-page__intro">
            Las cuotas son los conceptos que se cobran en el club. Después se eligen al
            registrar cada pago de un socio o jugador.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre de la cuota
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ej: Cuota mensual jugador"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${duplicatedName ? "is-invalid" : ""}`}
                maxLength={60}
                required
              />
              {duplicatedName ? (
                <div className="invalid-feedback">Ya existe una cuota con ese nombre.</div>
              ) : (
                <div className="form-page__help">
                  Usá un nombre que se entienda en el listado de pagos.
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Monto
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-control"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-page__help">
                Si el monto cambia más adelante, se actualiza desde Cuotas &gt; Actualizar montos.
              </div>
            </div>

            <div className="form-page__preview" aria-live="polite">
              <div>
                <span className="form-page__preview-label">Así se va a ver al cobrar</span>
                <span className="form-page__preview-name">
                  {formData.name.trim() || "Nombre de la cuota"}
                </span>
              </div>
              <span className="form-page__preview-amount">{formatCurrency(formData.amount)}</span>
            </div>

            {message && (
              <div
                className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}
                role="status"
              >
                {message.text}
              </div>
            )}

            <div className="form-page__actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFormData(EMPTY_FORM)}
                disabled={loading}
              >
                Limpiar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || duplicatedName}>
                {loading ? "Registrando..." : "Registrar cuota"}
              </button>
            </div>
          </form>
        </section>

        <aside className="panel form-page__panel">
          <h2 className="form-page__list-title">Cuotas actuales</h2>
          <p className="form-page__list-subtitle">
            {fees.length === 1 ? "1 cuota registrada" : `${fees.length} cuotas registradas`}
          </p>
          {fees.length === 0 ? (
            <p className="form-page__empty">Todavía no hay cuotas. La primera que registres aparece acá.</p>
          ) : (
            <ul className="form-page__list">
              {fees.map((fee) => (
                <li
                  key={fee.id}
                  className={`form-page__item ${fee.id === lastId ? "form-page__item--new" : ""}`}
                >
                  <span className="form-page__item-name">{fee.name}</span>
                  <span className="form-page__item-value">{formatCurrency(fee.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>
      <Footer />
    </>
  );
};

export default RegisterFee;
