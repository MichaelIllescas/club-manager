import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import ExportToExcelButton from "./ExportToExcelButton";
import "./TableGeneric.css";

// Readable labels for the columns sent by the backend
const COLUMN_LABELS = {
  id: "ID",
  firstName: "Nombre",
  lastName: "Apellido",
  name: "Nombre",
  dni: "DNI",
  phone: "Teléfono",
  address: "Dirección",
  email: "Email",
  role: "Rol",
  status: "Estado",
  actions: "Acciones",
  memberNumber: "N° de socio",
  registrationDate: "Fecha de registro",
  paymentDate: "Fecha de pago",
  registeredBy: "Registró",
  description: "Descripción",
  category: "Categoría",
  feeName: "Cuota",
  amount: "Monto",
  payments: "Pagos",
  players: "Jugadores",
  collected: "Recaudado",
  lastUpdated: "Última actualización",
  receipt: "Comprobante",
}

// Statuses are shown as badges so they stand out at a glance
const STATUS_STYLES = {
  ACTIVE: { label: "Activo", modifier: "active" },
  INACTIVE: { label: "Anulado", modifier: "inactive" },
};

const renderCell = (value) =>
  typeof value === "string" && STATUS_STYLES[value] ? (
    <span className={`status-badge status-badge--${STATUS_STYLES[value].modifier}`}>
      {STATUS_STYLES[value].label}
    </span>
  ) : (
    value
  );

const columnLabel = (key) =>
  COLUMN_LABELS[key] ??
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/^./, (letter) => letter.toUpperCase());

// `filters`: optional extra controls shown above the table
const TableGeneric = ({
  title = "Título de la tabla",
  data,
  columns: defaultColumns = [],
  actions = [],
  filters = null,
  emptyMessage = "Todavía no hay registros.",
  primaryAction = null,
}) => {
  const [filterInput, setFilterInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hiddenColumns, setHiddenColumns] = useState({});
  const itemsPerPage = 10;

  // Hooks run before any return: when the table goes from empty to having data,
  // React needs them to be called in the same order.
  const rows = useMemo(() => data ?? [], [data]);
  // With no data, the table still shows the columns provided by the screen
  const columns = useMemo(
    () => (rows.length > 0 ? Object.keys(rows[0]) : defaultColumns),
    [rows, defaultColumns]
  );

  const filteredData = useMemo(() => {
    return rows.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(filterInput.toLowerCase())
    );
  }, [filterInput, rows]);

  const sortedData = useMemo(() => {
    if (sortConfig.key) {
      return [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key]
          ? a[sortConfig.key].toString().toLowerCase()
          : "";
        const bValue = b[sortConfig.key]
          ? b[sortConfig.key].toString().toLowerCase()
          : "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filteredData;
  }, [sortConfig, filteredData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [currentPage, sortedData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (column) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === column) {
        return {
          key: column,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: column, direction: "asc" };
    });
  };

  const handleColumnToggle = (column) => {
    setHiddenColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const isVisible = (column) => !hiddenColumns[column];

  const visibleColumns = columns.filter(isVisible).length + (actions.length > 0 ? 1 : 0);

  return (
    <section className="data-table panel">
      <header className="data-table__header">
        <div>
          <h3 className="data-table__title">{title}</h3>
          <span className="data-table__total">
            {filteredData.length} {filteredData.length === 1 ? "registro" : "registros"}
          </span>
        </div>
        <div className="data-table__buttons">
          <ExportToExcelButton data={filteredData} fileName="tabla_datos.xlsx" />
          {primaryAction}
        </div>
      </header>

      <div className="data-table__toolbar">
        <div className="data-table__search">
          <i className="fas fa-search" aria-hidden="true"></i>
          <input
            type="search"
            value={filterInput}
            onChange={(e) => {
              setFilterInput(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar en la tabla..."
            aria-label="Buscar en la tabla"
            className="form-control"
          />
        </div>
        <div className="dropdown">
          <button
            type="button"
            className="btn btn-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            <i className="fas fa-columns me-2" aria-hidden="true"></i>Columnas
          </button>
          <div className="dropdown-menu dropdown-menu-end data-table__columns">
            {columns.map((column) => (
              <div key={column} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`column-${column}`}
                  checked={isVisible(column)}
                  onChange={() => handleColumnToggle(column)}
                />
                <label className="form-check-label" htmlFor={`column-${column}`}>
                  {columnLabel(column)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filters && <div className="mb-3">{filters}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              {columns.map(
                (column) =>
                  isVisible(column) && (
                    <th
                      key={column}
                      scope="col"
                      aria-sort={
                        sortConfig.key === column
                          ? sortConfig.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <button
                        type="button"
                        className="data-table__sort"
                        onClick={() => handleSort(column)}
                        title={`Ordenar por ${columnLabel(column)}`}
                      >
                        {columnLabel(column)}
                        <i
                          className={`fas ${
                            sortConfig.key !== column
                              ? "fa-sort"
                              : sortConfig.direction === "asc"
                              ? "fa-sort-up"
                              : "fa-sort-down"
                          }`}
                          aria-hidden="true"
                        ></i>
                      </button>
                    </th>
                  )
              )}
              {actions.length > 0 && <th scope="col">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={Math.max(visibleColumns, 1)} className="data-table__empty">
                  {rows.length === 0 ? emptyMessage : "Ningún registro coincide con la búsqueda."}
                </td>
              </tr>
            )}
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(
                  (column) => isVisible(column) && <td key={column}>{renderCell(row[column])}</td>
                )}
                {actions.length > 0 && (
                  <td>
                    <div className="data-table__actions">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          type="button"
                          className={`btn btn-sm ${action.className || "btn-primary"}`}
                          onClick={() => action.onClick(row)}
                        >
                          {action.icon && React.createElement(action.icon)} {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="data-table__pagination" aria-label="Paginación">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left me-1" aria-hidden="true"></i>Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente<i className="fas fa-chevron-right ms-1" aria-hidden="true"></i>
          </button>
        </nav>
      )}
    </section>
  );
};

TableGeneric.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
      icon: PropTypes.elementType,
    })
  ),
  columns: PropTypes.arrayOf(PropTypes.string),
  filters: PropTypes.node,
  emptyMessage: PropTypes.string,
  primaryAction: PropTypes.node,
};

export default TableGeneric;
