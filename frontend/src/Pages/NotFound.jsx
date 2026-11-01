import { Link, useLocation } from "react-router-dom";
import { useSession } from "../Auth/useSession";
import logo from "../assets/img/logo.svg";
import "./NoEncontrada.css";

// Página para direcciones que no existen o a las que el usuario no tiene acceso
const NoEncontrada = () => {
  const { usuario } = useSession();
  const { pathname } = useLocation();
  const destino = usuario ? "/inicio" : "/";

  return (
    <main className="no-encontrada">
      <div className="no-encontrada__caja">
        <img src={logo} alt="" width="72" height="72" />
        <p className="no-encontrada__codigo">404</p>
        <h1>Esta página no existe</h1>
        <p className="no-encontrada__texto">
          La dirección <code>{pathname}</code> no corresponde a ninguna sección, o tu usuario no
          tiene acceso a ella.
        </p>
        <Link to={destino} className="btn btn-primary">
          {usuario ? "Volver al inicio" : "Ir a ingresar"}
        </Link>
      </div>
    </main>
  );
};

export default NoEncontrada;
