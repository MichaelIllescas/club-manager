import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useSession } from "../Auth/useSession";
import apiClient from "../Config/axiosConfig";
import logo from "../assets/img/logo.svg";

 
const handleLogout = async () => {
  try {
    // 1. Informar al servidor sobre el cierre de sesión
    await apiClient.post("/auth/logout");

    // 2. El backend borra la cookie de sesión (es HttpOnly)

    // 3. Redirigir al usuario a la página de inicio de sesión
    window.location.href = "/";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("Ocurrió un error al intentar cerrar la sesión. Inténtalo nuevamente.");
  }
};


const NavBar = () => {
  const { rol: role, usuario } = useSession();
  return (
    <>
      {" "}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top cm-nav">
        <div className="container">
          <Link to={"/inicio"} className="navbar-brand cm-nav__marca">
            <img src={logo} width="40" height="40" alt="" />
            <span>Club Manager</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              {/* Gestión de Socios */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="sociosDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-id-card"></i> Socios
                </a>
                <ul className="dropdown-menu" aria-labelledby="sociosDropdown">
               
                  <li>
                    <Link to="/socios/nuevo" className="dropdown-item">
                      <i className="fas fa-user-plus"></i> Registrar socio
                    </Link>
                  </li>
                  <li>
                    <Link to="/socios" className="dropdown-item">
                      <i className="fas fa-list"></i> Lista de socios
                    </Link>
                  </li>
                
                  <li>
                    <Link to={"/socios/estado"} className="dropdown-item" >
                      <i className="fas fa-exchange-alt"></i> Cambiar estado
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Gestión de Jugadores */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="jugadoresDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-users"></i> Jugadores
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="jugadoresDropdown"
                >
                  
                  <li>
                    <Link to={"/jugadores/nuevo"} className="dropdown-item">
                      <i className="fas fa-user-plus"></i> Registrar jugador
                    </Link>
                  </li>
                  <li>
                    <Link to={"/jugadores"} className="dropdown-item">
                      <i className="fas fa-list"></i> Lista general de jugadores
                    </Link>
                  </li>
                  <li>
                    <Link to={"/jugadores/por-categoria"} className="dropdown-item">
                      <i className="fas fa-list"></i> Lista de jugadores por categoría
                    </Link>
                  </li>
                  <li>
                    <Link to={"/jugadores/estado"} className="dropdown-item">
                      <i className="fas fa-exchange-alt"></i> Cambiar estado
                    </Link>
                  </li>
                </ul>
              </li>

               {/* Gestión de Cuotas */}
               
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="cuotasDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-file-invoice-dollar"></i> Cuotas
                </a>
                <ul className="dropdown-menu" aria-labelledby="cuotasDropdown">
                {role === "ADMIN" && ( <li>
                    <Link
                      to="/cuotas/nueva"
                      className="dropdown-item"
                      href="#"
                    >
                      <i className="fas fa-plus-circle"></i> Registrar tipo de cuota
                    </Link>
                  </li>)}
                  {role === "ADMIN" && ( <li>
                    <Link
                      to="/cuotas/montos"
                      className="dropdown-item"
                      href="#"
                    >
                      <i className="fas fa-edit"></i> Actualizar montos
                    </Link>
                  </li>)}
                  <li>
                    <Link to="/cuotas" className="dropdown-item" href="#">
                      <i className="fas fa-list"></i> Consultar tipos de cuotas
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Gestión de Categorías */}
              {role === "ADMIN" && (<li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="categoriasDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-tags"></i> Categorías
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="categoriasDropdown"
                >
                  <li>
                    <Link
                      to={"/categorias/nueva"}
                      className="dropdown-item"
                      href="#"
                    >
                      <i className="fas fa-plus-circle"></i> Registrar categoría
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/categorias"}
                      className="dropdown-item"
                      href="#"
                    >
                      <i className="fas fa-list"></i> Ver categorías
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categorias/editar"
                      className="dropdown-item"
                      href="#"
                    >
                      <i className="fas fa-edit"></i> Actualizar categoría
                    </Link>
                  </li>
                </ul>
              </li> )}

              {/* Gestión de Pagos */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="pagosDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-money-bill-wave"></i> Pagos
                </a>
                <ul className="dropdown-menu" aria-labelledby="pagosDropdown">
                  <li>
                    <Link to={"/pagos/nuevo"} className="dropdown-item">
                      <i className="fas fa-plus-circle"></i> Registrar pago
                    </Link>
                  </li>
                  <li>
                    <Link to={"/pagos"} className="dropdown-item">
                      <i className="fas fa-eye"></i> Ver historial general de pagos
                    </Link>
                  </li>

                  <li>
                    <Link to={"/pagos/por-persona"} className="dropdown-item">
                      <i className="fas fa-user"></i> Pagos de un jugador o socio
                    </Link>
                  </li>
                  <li>
                    <Link to={"/pagos/por-categoria"} className="dropdown-item">
                      <i className="fas fa-th-list"></i> Pagos por categoría
                    </Link>
                  </li>
                  <li>
                    <Link to={"/pagos/por-fecha"} className="dropdown-item" >
                      <i className="fas fa-calendar-alt"></i> Pagos por fecha
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Gestión de Recaudaciones */}
             {role === "ADMIN" && ( <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="recaudacionesDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-wallet"></i> Recaudaciones
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="recaudacionesDropdown"
                >
                  <li>
                    <Link to={"/recaudaciones/anuales"} className="dropdown-item" >
                      <i className="fas fa-eye"></i> Recaudaciones anuales
                    </Link>
                  </li>
                  <li>
                    <Link to={"/recaudaciones/trimestrales"} className="dropdown-item" >
                      <i className="fas fa-chart-line"></i> Recaudaciones trimestrales
                    </Link>
                  </li>
               
                </ul>
              </li> )}

              {/* Gestión de Usuarios */}
              {role === "ADMIN" && (<li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="usuariosDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-users-cog me-2"></i>Usuarios
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="usuariosDropdown"
                >
                  <li>
                    <Link to={"/usuarios/nuevo"} className="dropdown-item" >
                      <i className="fas fa-user-plus me-2"></i>Registrar usuario
                    </Link>
                  </li>
                  <li>
                    <Link to={"/usuarios"} className="dropdown-item" >
                      <i className="fas fa-users me-2"></i>Ver usuarios
                    </Link>
                  </li>
                 
                  <li>
                    <Link to={"/usuarios/estado"} className="dropdown-item" >
                      <i className="fas fa-user-times me-2"></i>Cambiar estado
                    </Link>
                  </li>
               
                </ul>
              </li> ) }
            </ul>
            {/* Menú de usuario */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle fa-lg me-2"></i>
                  {usuario?.nombre ?? "Mi cuenta"}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link to="/perfil" className="dropdown-item">
                      <i className="fas fa-user-edit me-2"></i>Actualizar perfil
                    </Link>
                  </li>
                  <li>
                    <Link to="/perfil/clave" className="dropdown-item">
                      <i className="fas fa-key me-2"></i>Cambiar contraseña
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item cm-nav__salir"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmLogoutModal"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>
        {/* Modal de Confirmación de Cerrar Sesión */}
        <div
          className="modal fade"
          id="confirmLogoutModal"
          tabIndex="-1"
          aria-labelledby="confirmLogoutModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmLogoutModalLabel">
                  Cerrar sesión
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body">
                Vas a tener que volver a ingresar con tu email y contraseña.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
  type="button"
  className="btn btn-danger"
  onClick={handleLogout}
  data-bs-dismiss="modal"
>
  Cerrar Sesión
</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
