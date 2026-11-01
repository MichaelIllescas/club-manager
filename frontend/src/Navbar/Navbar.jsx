import { Link } from "react-router-dom";
import { useSession } from "../Auth/useSession";
import apiClient from "../Config/axiosConfig";
import logo from "../assets/img/logo.svg";

// Secciones del menú. "soloAdmin" oculta la sección o el item a los usuarios comunes;
// el backend también rechaza esas operaciones.
const SECCIONES = [
  {
    nombre: "Socios",
    icono: "fa-id-card",
    items: [
      { to: "/socios/nuevo", icono: "fa-user-plus", texto: "Registrar socio" },
      { to: "/socios", icono: "fa-list", texto: "Lista de socios" },
      { to: "/socios/estado", icono: "fa-exchange-alt", texto: "Cambiar estado" },
    ],
  },
  {
    nombre: "Jugadores",
    icono: "fa-users",
    items: [
      { to: "/jugadores/nuevo", icono: "fa-user-plus", texto: "Registrar jugador" },
      { to: "/jugadores", icono: "fa-list", texto: "Lista de jugadores" },
      { to: "/jugadores/por-categoria", icono: "fa-th-list", texto: "Jugadores por categoría" },
      { to: "/jugadores/estado", icono: "fa-exchange-alt", texto: "Cambiar estado" },
    ],
  },
  {
    nombre: "Cuotas",
    icono: "fa-file-invoice-dollar",
    items: [
      { to: "/cuotas/nueva", icono: "fa-plus-circle", texto: "Registrar cuota", soloAdmin: true },
      { to: "/cuotas/montos", icono: "fa-edit", texto: "Actualizar montos", soloAdmin: true },
      { to: "/cuotas", icono: "fa-list", texto: "Lista de cuotas" },
    ],
  },
  {
    nombre: "Categorías",
    icono: "fa-tags",
    soloAdmin: true,
    items: [
      { to: "/categorias/nueva", icono: "fa-plus-circle", texto: "Registrar categoría" },
      { to: "/categorias", icono: "fa-list", texto: "Lista de categorías" },
      { to: "/categorias/editar", icono: "fa-edit", texto: "Actualizar categoría" },
    ],
  },
  {
    nombre: "Pagos",
    icono: "fa-money-bill-wave",
    items: [
      { to: "/pagos/nuevo", icono: "fa-plus-circle", texto: "Registrar pago" },
      { to: "/pagos", icono: "fa-list", texto: "Todos los pagos" },
      { to: "/pagos/por-persona", icono: "fa-user", texto: "Pagos de un jugador o socio" },
      { to: "/pagos/por-categoria", icono: "fa-th-list", texto: "Pagos por categoría" },
      { to: "/pagos/por-fecha", icono: "fa-calendar-alt", texto: "Pagos por fecha" },
    ],
  },
  {
    nombre: "Recaudaciones",
    icono: "fa-wallet",
    soloAdmin: true,
    items: [
      { to: "/recaudaciones/anuales", icono: "fa-chart-bar", texto: "Recaudación anual" },
      { to: "/recaudaciones/trimestrales", icono: "fa-chart-line", texto: "Recaudación trimestral" },
    ],
  },
  {
    nombre: "Usuarios",
    icono: "fa-users-cog",
    soloAdmin: true,
    items: [
      { to: "/usuarios/nuevo", icono: "fa-user-plus", texto: "Registrar usuario" },
      { to: "/usuarios", icono: "fa-users", texto: "Lista de usuarios" },
      { to: "/usuarios/estado", icono: "fa-user-times", texto: "Cambiar estado" },
    ],
  },
];

const cerrarSesion = async () => {
  try {
    // El backend borra la cookie de sesión (es HttpOnly)
    await apiClient.post("/auth/logout");
    window.location.href = "/";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión. Intentá nuevamente.");
  }
};

const Navbar = () => {
  const { rol, usuario } = useSession();
  const esAdmin = rol === "ADMIN";
  const visible = (elemento) => esAdmin || !elemento.soloAdmin;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top cm-nav">
        <div className="container">
          <Link to="/inicio" className="navbar-brand cm-nav__marca">
            <img src={logo} width="40" height="40" alt="" />
            <span>Club Manager</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav me-auto">
              {SECCIONES.filter(visible).map((seccion) => (
                <li key={seccion.nombre} className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className={`fas ${seccion.icono}`} aria-hidden="true"></i> {seccion.nombre}
                  </a>
                  <ul className="dropdown-menu">
                    {seccion.items.filter(visible).map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} className="dropdown-item">
                          <i className={`fas ${item.icono}`} aria-hidden="true"></i> {item.texto}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle fa-lg me-2" aria-hidden="true"></i>
                  {usuario?.nombre ?? "Mi cuenta"}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link to="/perfil" className="dropdown-item">
                      <i className="fas fa-user-edit me-2" aria-hidden="true"></i>Mi perfil
                    </Link>
                  </li>
                  <li>
                    <Link to="/perfil/clave" className="dropdown-item">
                      <i className="fas fa-key me-2" aria-hidden="true"></i>Cambiar contraseña
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item cm-nav__salir"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmarCierreSesion"
                    >
                      <i className="fas fa-sign-out-alt me-2" aria-hidden="true"></i>Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        className="modal fade"
        id="confirmarCierreSesion"
        tabIndex="-1"
        aria-labelledby="confirmarCierreSesionTitulo"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmarCierreSesionTitulo">
                Cerrar sesión
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">Vas a tener que volver a ingresar con tu email y contraseña.</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={cerrarSesion} data-bs-dismiss="modal">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
