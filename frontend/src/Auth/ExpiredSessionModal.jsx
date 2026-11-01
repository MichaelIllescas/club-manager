import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SESION_EXPIRADA } from "../Config/axiosConfig";

// Muestra un aviso cuando el backend responde 401 (sesión vencida o inexistente)
function SesionExpirada() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mostrar = () => setVisible(true);
    window.addEventListener(SESION_EXPIRADA, mostrar);
    return () => window.removeEventListener(SESION_EXPIRADA, mostrar);
  }, []);

  if (!visible || location.pathname === "/") {
    return null;
  }

  const volverAlLogin = () => {
    setVisible(false);
    navigate("/");
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sesión expirada</h5>
          </div>
          <div className="modal-body">
            <p>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={volverAlLogin}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SesionExpirada;
