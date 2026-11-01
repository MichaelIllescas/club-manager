import PropTypes from "prop-types";
import "./SummaryStrip.css";

// Totals strip shown above a list
const SummaryStrip = ({ data }) => (
  <section className="summary-strip" aria-label="Resumen">
    {data.map((item) => (
      <div key={item.label} className="summary-strip__item">
        <span className="summary-strip__value">{item.value}</span>
        <span className="summary-strip__label">{item.label}</span>
      </div>
    ))}
  </section>
);

SummaryStrip.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
    })
  ).isRequired,
};

export default SummaryStrip;
