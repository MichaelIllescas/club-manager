import { Link, useLocation } from "react-router-dom";
import { useSession } from "../Auth/useSession";
import logo from "../assets/img/logo.svg";
import "./NotFound.css";

// Page for addresses that do not exist or that the user cannot access
const NotFound = () => {
  const { user } = useSession();
  const { pathname } = useLocation();
  const target = user ? "/inicio" : "/";

  return (
    <main className="not-found">
      <div className="not-found__box">
        <img src={logo} alt="" width="72" height="72" />
        <p className="not-found__code">404</p>
        <h1>Esta página no existe</h1>
        <p className="not-found__text">
          La dirección <code>{pathname}</code> no corresponde a ninguna sección, o tu usuario no
          tiene acceso a ella.
        </p>
        <Link to={target} className="btn btn-primary">
          {user ? "Volver al inicio" : "Ir a ingresar"}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
