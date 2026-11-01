import PropTypes from "prop-types";
import "./ResumenLista.css";

// Franja de totales arriba de un listado
const ResumenLista = ({ datos }) => (
  <section className="resumen-lista" aria-label="Resumen">
    {datos.map((dato) => (
      <div key={dato.nombre} className="resumen-lista__dato">
        <span className="resumen-lista__valor">{dato.valor}</span>
        <span className="resumen-lista__nombre">{dato.nombre}</span>
      </div>
    ))}
  </section>
);

ResumenLista.propTypes = {
  datos: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      valor: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default ResumenLista;
