import { Link } from "react-router-dom";
import { useSession } from "../Auth/useSession";
import apiClient from "../Config/axiosConfig";
import logo from "../assets/img/logo.svg";

// Menu sections. "adminOnly" hides the section or item from regular users;
// the backend rejects those operations too.
const SECTIONS = [
  {
    label: "Socios",
    icon: "fa-id-card",
    items: [
      { to: "/socios/nuevo", icon: "fa-user-plus", text: "Registrar socio" },
      { to: "/socios", icon: "fa-list", text: "Lista de socios" },
      { to: "/socios/estado", icon: "fa-exchange-alt", text: "Cambiar estado" },
    ],
  },
  {
    label: "Jugadores",
    icon: "fa-users",
    items: [
      { to: "/jugadores/nuevo", icon: "fa-user-plus", text: "Registrar jugador" },
      { to: "/jugadores", icon: "fa-list", text: "Lista de jugadores" },
      { to: "/jugadores/por-categoria", icon: "fa-th-list", text: "Jugadores por categoría" },
      { to: "/jugadores/estado", icon: "fa-exchange-alt", text: "Cambiar estado" },
    ],
  },
  {
    label: "Cuotas",
    icon: "fa-file-invoice-dollar",
    items: [
      { to: "/cuotas/nueva", icon: "fa-plus-circle", text: "Registrar cuota", adminOnly: true },
      { to: "/cuotas/montos", icon: "fa-edit", text: "Actualizar montos", adminOnly: true },
      { to: "/cuotas", icon: "fa-list", text: "Lista de cuotas" },
    ],
  },
  {
    label: "Categorías",
    icon: "fa-tags",
    adminOnly: true,
    items: [
      { to: "/categorias/nueva", icon: "fa-plus-circle", text: "Registrar categoría" },
      { to: "/categorias", icon: "fa-list", text: "Lista de categorías" },
      { to: "/categorias/editar", icon: "fa-edit", text: "Actualizar categoría" },
    ],
  },
  {
    label: "Pagos",
    icon: "fa-money-bill-wave",
    items: [
      { to: "/pagos/nuevo", icon: "fa-plus-circle", text: "Registrar pago" },
      { to: "/pagos", icon: "fa-list", text: "Todos los pagos" },
      { to: "/pagos/por-persona", icon: "fa-user", text: "Pagos de un jugador o socio" },
      { to: "/pagos/por-categoria", icon: "fa-th-list", text: "Pagos por categoría" },
      { to: "/pagos/por-fecha", icon: "fa-calendar-alt", text: "Pagos por fecha" },
    ],
  },
  {
    label: "Recaudaciones",
    icon: "fa-wallet",
    adminOnly: true,
    items: [
      { to: "/recaudaciones/anuales", icon: "fa-chart-bar", text: "Recaudación anual" },
      { to: "/recaudaciones/trimestrales", icon: "fa-chart-line", text: "Recaudación trimestral" },
    ],
  },
  {
    label: "Usuarios",
    icon: "fa-users-cog",
    adminOnly: true,
    items: [
      { to: "/usuarios/nuevo", icon: "fa-user-plus", text: "Registrar usuario" },
      { to: "/usuarios", icon: "fa-users", text: "Lista de usuarios" },
      { to: "/usuarios/estado", icon: "fa-user-times", text: "Cambiar estado" },
    ],
  },
];

const logout = async () => {
  try {
    // The backend deletes the session cookie (it is HttpOnly)
    await apiClient.post("/auth/logout");
    window.location.href = "/";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar la sesión. Intentá nuevamente.");
  }
};

const Navbar = () => {
  const { role, user } = useSession();
  const isAdmin = role === "ADMIN";
  const visible = (entry) => isAdmin || !entry.adminOnly;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top cm-nav">
        <div className="container">
          <Link to="/inicio" className="navbar-brand cm-nav__brand">
            <img src={logo} width="40" height="40" alt="" />
            <span>Club Manager</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainMenu"
            aria-controls="mainMenu"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainMenu">
            <ul className="navbar-nav me-auto">
              {SECTIONS.filter(visible).map((section) => (
                <li key={section.label} className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className={`fas ${section.icon}`} aria-hidden="true"></i> {section.label}
                  </a>
                  <ul className="dropdown-menu">
                    {section.items.filter(visible).map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} className="dropdown-item">
                          <i className={`fas ${item.icon}`} aria-hidden="true"></i> {item.text}
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
                  {user?.firstName ?? "Mi cuenta"}
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
                      className="dropdown-item cm-nav__logout"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmLogout"
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
        id="confirmLogout"
        tabIndex="-1"
        aria-labelledby="confirmLogoutTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmLogoutTitle">
                Cerrar sesión
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">Vas a tener que volver a ingresar con tu email y contraseña.</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={logout} data-bs-dismiss="modal">
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
