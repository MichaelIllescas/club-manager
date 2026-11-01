import PropTypes from "prop-types";
import * as XLSX from "xlsx";

const ExportToExcelButton = ({ data, fileName = "data.xlsx" }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // Crear un libro de trabajo (workbook) y una hoja de trabajo (worksheet)
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <button type="button" className="btn btn-secondary" onClick={handleExport}>
      <i className="fas fa-file-excel me-2" aria-hidden="true"></i>
      Exportar a Excel
    </button>
  );
};

ExportToExcelButton.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileName: PropTypes.string,
};

export default ExportToExcelButton;
