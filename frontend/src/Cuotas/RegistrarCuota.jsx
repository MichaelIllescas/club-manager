import Footer from "../Index/Footer";
import Header from "../Navbar/Header";
import { useEffect, useState } from "react";
import apiClient from "../Config/axiosConfig";
import { formatearMoneda } from "../Utils/formatearMoneda";
import "../Components/Alta.css";

const FORMULARIO_VACIO = { type: "", amount: "" };

const RegistrarCuota = () => {
  const [formData, setFormData] = useState(FORMULARIO_VACIO);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cuotas, setCuotas] = useState([]);
  const [ultimaId, setUltimaId] = useState(null);

  const cargarCuotas = async () => {
    try {
      const response = await apiClient.get("/api/cuotas");
      setCuotas(response.data);
    } catch (error) {
      console.error("Error al cargar las cuotas:", error);
    }
  };

  useEffect(() => {
    cargarCuotas();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const tipoRepetido = cuotas.some(
    (cuota) => cuota.tipo?.trim().toLowerCase() === formData.type.trim().toLowerCase()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiClient.post("/api/cuotas", {
        tipo: formData.type.trim(),
        monto: parseFloat(formData.amount),
        fechaRegistro: new Date().toISOString(),
      });

      setMessage({ text: `Se registró la cuota "${formData.type.trim()}".`, type: "success" });
      setUltimaId(response.data?.id ?? null);
      setFormData(FORMULARIO_VACIO);
      cargarCuotas();
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
      <main className="container alta">
        <section className="panel alta__panel">
          <h1 className="alta__titulo">Registrar cuota</h1>
          <p className="alta__intro">
            Las cuotas son los conceptos que se cobran en el club. Después se eligen al
            registrar cada pago de un socio o jugador.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Nombre de la cuota
              </label>
              <input
                type="text"
                id="type"
                name="type"
                placeholder="Ej: Cuota mensual jugador"
                value={formData.type}
                onChange={handleChange}
                className={`form-control ${tipoRepetido ? "is-invalid" : ""}`}
                maxLength={60}
                required
              />
              {tipoRepetido ? (
                <div className="invalid-feedback">Ya existe una cuota con ese nombre.</div>
              ) : (
                <div className="alta__ayuda">
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
              <div className="alta__ayuda">
                Si el monto cambia más adelante, se actualiza desde Cuotas &gt; Actualizar montos.
              </div>
            </div>

            <div className="alta__vista" aria-live="polite">
              <div>
                <span className="alta__vista-etiqueta">Así se va a ver al cobrar</span>
                <span className="alta__vista-nombre">
                  {formData.type.trim() || "Nombre de la cuota"}
                </span>
              </div>
              <span className="alta__vista-monto">{formatearMoneda(formData.amount)}</span>
            </div>

            {message && (
              <div
                className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}
                role="status"
              >
                {message.text}
              </div>
            )}

            <div className="alta__acciones">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFormData(FORMULARIO_VACIO)}
                disabled={loading}
              >
                Limpiar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || tipoRepetido}>
                {loading ? "Registrando..." : "Registrar cuota"}
              </button>
            </div>
          </form>
        </section>

        <aside className="panel alta__panel">
          <h2 className="alta__lista-titulo">Cuotas actuales</h2>
          <p className="alta__lista-sub">
            {cuotas.length === 1 ? "1 cuota registrada" : `${cuotas.length} cuotas registradas`}
          </p>
          {cuotas.length === 0 ? (
            <p className="alta__vacio">Todavía no hay cuotas. La primera que registres aparece acá.</p>
          ) : (
            <ul className="alta__lista">
              {cuotas.map((cuota) => (
                <li
                  key={cuota.id}
                  className={`alta__item ${cuota.id === ultimaId ? "alta__item--nuevo" : ""}`}
                >
                  <span className="alta__item-nombre">{cuota.tipo}</span>
                  <span className="alta__item-valor">{formatearMoneda(cuota.monto)}</span>
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

export default RegistrarCuota;
