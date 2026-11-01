import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import apiClient from "../Config/axiosConfig";
import Header from "../Navbar/Header";
import Footer from "../Index/Footer";
import "./Alta.css";

// Estructura común de las pantallas de alta y edición:
// el formulario a la izquierda y, si hay, información de contexto a la derecha.
const PaginaAlta = ({ titulo, intro, lateral, ancha = false, children }) => (
  <>
    <Header />
    <main className={`container alta ${lateral ? "" : ancha ? "alta--ancha" : "alta--sola"}`}>
      <section className="panel alta__panel">
        <h1 className="alta__titulo">{titulo}</h1>
        {intro && <p className="alta__intro">{intro}</p>}
        {children}
      </section>
      {lateral}
    </main>
    <Footer />
  </>
);

PaginaAlta.propTypes = {
  titulo: PropTypes.string.isRequired,
  intro: PropTypes.node,
  lateral: PropTypes.node,
  ancha: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

// Lista lateral con lo ya registrado (los últimos primero)
export const ListaLateral = ({ titulo, items, vacio, resaltarId, limite = 8 }) => {
  const visibles = [...items].reverse().slice(0, limite);

  return (
    <aside className="panel alta__panel">
      <h2 className="alta__lista-titulo">{titulo}</h2>
      <p className="alta__lista-sub">
        {items.length === 1 ? "1 registro" : `${items.length} registros`}
        {items.length > limite ? ` · se muestran los últimos ${limite}` : ""}
      </p>
      {items.length === 0 ? (
        <p className="alta__vacio">{vacio}</p>
      ) : (
        <ul className="alta__lista">
          {visibles.map((item) => (
            <li
              key={item.id}
              className={`alta__item ${item.id === resaltarId ? "alta__item--nuevo" : ""}`}
            >
              <span>
                <span className="alta__item-nombre">{item.nombre}</span>
                {item.detalle && <span className="alta__item-detalle">{item.detalle}</span>}
              </span>
              {item.valor && <span className="alta__item-valor">{item.valor}</span>}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

ListaLateral.propTypes = {
  titulo: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      nombre: PropTypes.node.isRequired,
      detalle: PropTypes.node,
      valor: PropTypes.node,
    })
  ).isRequired,
  vacio: PropTypes.string.isRequired,
  resaltarId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  limite: PropTypes.number,
};

// Lista lateral que pide sus datos al backend; vuelve a cargar cuando cambia "recarga"
export const ListaRemota = ({ url, mapear, recarga = 0, ...props }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    apiClient
      .get(url)
      .then((response) => setItems(response.data.map(mapear)))
      .catch(() => setItems([]));
    // mapear es una función de la pantalla; sólo se recarga por url o recarga
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, recarga]);

  return <ListaLateral items={items} {...props} />;
};

ListaRemota.propTypes = {
  url: PropTypes.string.isRequired,
  mapear: PropTypes.func.isRequired,
  recarga: PropTypes.number,
  titulo: PropTypes.string.isRequired,
  vacio: PropTypes.string.isRequired,
};

// Panel lateral de texto, para pantallas sin una lista que mostrar
export const NotaLateral = ({ titulo, children }) => (
  <aside className="panel alta__panel">
    <h2 className="alta__lista-titulo">{titulo}</h2>
    <div className="alta__nota">{children}</div>
  </aside>
);

NotaLateral.propTypes = {
  titulo: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default PaginaAlta;
