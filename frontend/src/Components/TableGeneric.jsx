import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import ExportToExcelButton from "./ExportToExcelButton";
import "./TableGeneric.css";

// Nombres legibles para las columnas que vienen del backend
const NOMBRES = {
  id: "ID",
  dni: "DNI",
  telefono: "Teléfono",
  direccion: "Dirección",
  email: "Email",
  rol: "Rol",
  numeroSocio: "N° de socio",
  fechaRegistro: "Fecha de registro",
  fechaPago: "Fecha de pago",
  usuario_registro: "Registró",
  descripcion: "Descripción",
  categoria: "Categoría",
  actualizada: "Última actualización",
  recaudado: "Recaudado",
};

// Los estados se muestran como etiquetas para distinguirlos de un vistazo
const ESTADOS = { ACTIVO: "activo", HABILITADO: "activo", ANULADO: "anulado", INACTIVO: "anulado", DESHABILITADO: "anulado" };

const celda = (valor) =>
  typeof valor === "string" && ESTADOS[valor] ? (
    <span className={`estado estado--${ESTADOS[valor]}`}>{valor.charAt(0) + valor.slice(1).toLowerCase()}</span>
  ) : (
    valor
  );

const nombreColumna = (clave) =>
  NOMBRES[clave] ??
  clave
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/^./, (letra) => letra.toUpperCase());

// `filtros`: controles extra opcionales que se muestran debajo de "Mostrar columnas"
const TableGeneric = ({
  titulo = "Título de la tabla",
  data,
  columnas = [],
  actions = [],
  filtros = null,
  mensajeVacio = "Todavía no hay registros.",
  accionPrincipal = null,
}) => {
  const [filterInput, setFilterInput] = useState(""); // Estado del filtro
  const [currentPage, setCurrentPage] = useState(1); // Estado de la página actual
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Estado de ordenamiento
  const [hiddenColumns, setHiddenColumns] = useState({}); // Columnas ocultas por el usuario
  const itemsPerPage = 10; // Elementos por página

  // Los hooks van antes de cualquier return: si la tabla pasa de vacía a tener datos,
  // React necesita que se llamen siempre en el mismo orden.
  const rows = useMemo(() => data ?? [], [data]);
  // Sin datos, la tabla igual se muestra con las columnas que indica la pantalla
  const columns = useMemo(
    () => (rows.length > 0 ? Object.keys(rows[0]) : columnas),
    [rows, columnas]
  );

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    return rows.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(filterInput.toLowerCase())
    );
  }, [filterInput, rows]);

  // Ordenar datos
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

  // Paginación
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

  const columnasVisibles = columns.filter(isVisible).length + (actions.length > 0 ? 1 : 0);

  return (
    <section className="tabla panel">
      <header className="tabla__encabezado">
        <div>
          <h3 className="tabla__titulo">{titulo}</h3>
          <span className="tabla__total">
            {filteredData.length} {filteredData.length === 1 ? "registro" : "registros"}
          </span>
        </div>
        <div className="tabla__botones">
          <ExportToExcelButton data={filteredData} fileName="tabla_datos.xlsx" />
          {accionPrincipal}
        </div>
      </header>

      <div className="tabla__herramientas">
        <div className="tabla__buscar">
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
          <div className="dropdown-menu dropdown-menu-end tabla__columnas">
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
                  {nombreColumna(column)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filtros && <div className="mb-3">{filtros}</div>}

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
                        className="tabla__orden"
                        onClick={() => handleSort(column)}
                        title={`Ordenar por ${nombreColumna(column)}`}
                      >
                        {nombreColumna(column)}
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
                <td colSpan={Math.max(columnasVisibles, 1)} className="tabla__vacia">
                  {rows.length === 0 ? mensajeVacio : "Ningún registro coincide con la búsqueda."}
                </td>
              </tr>
            )}
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(
                  (column) => isVisible(column) && <td key={column}>{celda(row[column])}</td>
                )}
                {actions.length > 0 && (
                  <td>
                    <div className="tabla__acciones">
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
        <nav className="tabla__paginas" aria-label="Paginación">
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
  titulo: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
      icon: PropTypes.elementType,
    })
  ),
  columnas: PropTypes.arrayOf(PropTypes.string),
  filtros: PropTypes.node,
  mensajeVacio: PropTypes.string,
  accionPrincipal: PropTypes.node,
};

export default TableGeneric;
