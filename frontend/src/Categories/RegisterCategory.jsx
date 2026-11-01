import { useEffect, useState } from "react";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import apiClient from "../Config/axiosConfig";
import "../Components/FormPage.css";

const MAX_DESCRIPTION = 255;

const RegisterCategory = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [lastId, setLastId] = useState(null);

  const loadCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const duplicatedName = categories.some(
    (c) => c.name?.trim().toLowerCase() === category.trim().toLowerCase()
  );

  const clear = () => {
    setCategory("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiClient.post("/api/categories", {
        name: category.trim(),
        description: description.trim(),
      });
      setMessage({ text: `Se registró la categoría "${category.trim()}".`, type: "success" });
      setLastId(response.data?.id ?? null);
      clear();
      loadCategories();
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.error ||
          "No se pudo registrar la categoría. Revisá el nombre.",
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
          <h1 className="form-page__title">Registrar categoría</h1>
          <p className="form-page__intro">
            Las categorías agrupan a los jugadores, por ejemplo por edad o por división. Cada
            jugador se asigna a una y los pagos se pueden consultar por categoría.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="category"
                className={`form-control ${duplicatedName ? "is-invalid" : ""}`}
                placeholder="Ej: Sub 15"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={100}
                required
              />
              {duplicatedName ? (
                <div className="invalid-feedback">Ya existe una categoría con ese nombre.</div>
              ) : (
                <div className="form-page__help">Es el nombre que se ve en los listados y filtros.</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Descripción
                <span className="form-page__counter">
                  {description.length}/{MAX_DESCRIPTION}
                </span>
              </label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Ej: Jugadores nacidos en 2011 y 2012"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={MAX_DESCRIPTION}
                rows="4"
              />
              <div className="form-page__help">Opcional. Sirve para aclarar quiénes entran en la categoría.</div>
            </div>

            <div className="form-page__preview" aria-live="polite">
              <div>
                <span className="form-page__preview-label">Así se va a ver en los listados</span>
                <span className="form-page__preview-name">{category.trim() || "Nombre de la categoría"}</span>
                <span className="form-page__item-detail">{description.trim() || "Sin descripción"}</span>
              </div>
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
              <button type="button" className="btn btn-secondary" onClick={clear} disabled={loading}>
                Limpiar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || duplicatedName}
              >
                {loading ? "Registrando..." : "Registrar categoría"}
              </button>
            </div>
          </form>
        </section>

        <aside className="panel form-page__panel">
          <h2 className="form-page__list-title">Categorías actuales</h2>
          <p className="form-page__list-subtitle">
            {categories.length === 1
              ? "1 categoría registrada"
              : `${categories.length} categorías registradas`}
          </p>
          {categories.length === 0 ? (
            <p className="form-page__empty">
              Todavía no hay categorías. La primera que registres aparece acá.
            </p>
          ) : (
            <ul className="form-page__list">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className={`form-page__item ${c.id === lastId ? "form-page__item--new" : ""}`}
                >
                  <span>
                    <span className="form-page__item-name">{c.name}</span>
                    {c.description && <span className="form-page__item-detail">{c.description}</span>}
                  </span>
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

export default RegisterCategory;
