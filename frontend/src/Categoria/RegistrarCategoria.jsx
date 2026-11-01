import { useEffect, useState } from "react";
import Header from "../Navbar/Header";
import Footer from "../Index/Footer";
import apiClient from "../Config/axiosConfig";
import "../Components/Alta.css";

const MAX_DESCRIPCION = 255;

const RegistrarCategoria = () => {
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [ultimaId, setUltimaId] = useState(null);

  const cargarCategorias = async () => {
    try {
      const response = await apiClient.get("/api/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const nombreRepetido = categorias.some(
    (c) => c.nombre?.trim().toLowerCase() === categoria.trim().toLowerCase()
  );

  const limpiar = () => {
    setCategoria("");
    setDescripcion("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const response = await apiClient.post("/api/categorias", {
        nombre: categoria.trim(),
        descripcion: descripcion.trim(),
      });
      setMensaje({ texto: `Se registró la categoría "${categoria.trim()}".`, tipo: "success" });
      setUltimaId(response.data?.id ?? null);
      limpiar();
      cargarCategorias();
    } catch (error) {
      setMensaje({
        texto:
          error.response?.data?.error ||
          "No se pudo registrar la categoría. Revisá el nombre.",
        tipo: "error",
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
          <h1 className="alta__titulo">Registrar categoría</h1>
          <p className="alta__intro">
            Las categorías agrupan a los jugadores, por ejemplo por edad o por división. Cada
            jugador se asigna a una y los pagos se pueden consultar por categoría.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="categoria"
                className={`form-control ${nombreRepetido ? "is-invalid" : ""}`}
                placeholder="Ej: Sub 15"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                maxLength={100}
                required
              />
              {nombreRepetido ? (
                <div className="invalid-feedback">Ya existe una categoría con ese nombre.</div>
              ) : (
                <div className="alta__ayuda">Es el nombre que se ve en los listados y filtros.</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción
                <span className="alta__contador">
                  {descripcion.length}/{MAX_DESCRIPCION}
                </span>
              </label>
              <textarea
                id="descripcion"
                className="form-control"
                placeholder="Ej: Jugadores nacidos en 2011 y 2012"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={MAX_DESCRIPCION}
                rows="4"
              />
              <div className="alta__ayuda">Opcional. Sirve para aclarar quiénes entran en la categoría.</div>
            </div>

            <div className="alta__vista" aria-live="polite">
              <div>
                <span className="alta__vista-etiqueta">Así se va a ver en los listados</span>
                <span className="alta__vista-nombre">{categoria.trim() || "Nombre de la categoría"}</span>
                <span className="alta__item-detalle">{descripcion.trim() || "Sin descripción"}</span>
              </div>
            </div>

            {mensaje && (
              <div
                className={`alert ${mensaje.tipo === "success" ? "alert-success" : "alert-danger"}`}
                role="status"
              >
                {mensaje.texto}
              </div>
            )}

            <div className="alta__acciones">
              <button type="button" className="btn btn-secondary" onClick={limpiar} disabled={loading}>
                Limpiar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || nombreRepetido}
              >
                {loading ? "Registrando..." : "Registrar categoría"}
              </button>
            </div>
          </form>
        </section>

        <aside className="panel alta__panel">
          <h2 className="alta__lista-titulo">Categorías actuales</h2>
          <p className="alta__lista-sub">
            {categorias.length === 1
              ? "1 categoría registrada"
              : `${categorias.length} categorías registradas`}
          </p>
          {categorias.length === 0 ? (
            <p className="alta__vacio">
              Todavía no hay categorías. La primera que registres aparece acá.
            </p>
          ) : (
            <ul className="alta__lista">
              {categorias.map((c) => (
                <li
                  key={c.id}
                  className={`alta__item ${c.id === ultimaId ? "alta__item--nuevo" : ""}`}
                >
                  <span>
                    <span className="alta__item-nombre">{c.nombre}</span>
                    {c.descripcion && <span className="alta__item-detalle">{c.descripcion}</span>}
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

export default RegistrarCategoria;
