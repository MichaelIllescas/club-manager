import  { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import logo from '../assets/img/logo.svg';
import Footer from "./Footer";
import "./Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const doValidation = () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    document.getElementById("errorEmail").innerHTML = emailInput.checkValidity()
      ? ""
      : emailInput.validationMessage;

    document.getElementById("errorPassword").innerHTML = passwordInput.checkValidity()
      ? ""
      : passwordInput.validationMessage;

    return emailInput.checkValidity() && passwordInput.checkValidity();
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!doValidation()) return;

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      if (rememberMe) {
        localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("email");
      }
      if (response.status==200){
        window.location.href = "/index";
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Usuario o contraseña incorrectos.");
        } else if (error.response.status === 500) {
          setErrorMessage("Error al conectarse al servidor. Intente más tarde.");
        } else if (error.response.status === 403) {
          setErrorMessage("Usuario Inhabilitado.");
        }  
        else {
          setErrorMessage("Ocurrió un error inesperado.");
        }
      } else {
        setErrorMessage("No se pudo conectar al servidor. Verifique su conexión a Internet.");
      }
    }
  };

  return (
    <div className="login">
      <aside className="login__cancha" aria-hidden="true">
        <svg className="login__lineas" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice">
          <rect x="40" y="40" width="520" height="820" />
          <line x1="40" y1="450" x2="560" y2="450" />
          <circle cx="300" cy="450" r="90" />
          <circle cx="300" cy="450" r="4" className="login__punto" />
          <rect x="170" y="40" width="260" height="140" />
          <rect x="235" y="40" width="130" height="55" />
          <rect x="170" y="720" width="260" height="140" />
          <rect x="235" y="805" width="130" height="55" />
          <path d="M240 180 A70 70 0 0 0 360 180" />
          <path d="M240 720 A70 70 0 0 1 360 720" />
        </svg>
        <div className="login__marca">
          <img src={logo} alt="" width="88" height="88" />
          <h1>Club Manager</h1>
          <p>Socios, jugadores, cuotas y pagos del club en un solo lugar.</p>
        </div>
      </aside>

      <main className="login__formulario">
        <form onSubmit={handleLogin} noValidate className="login__caja">
          <img src={logo} alt="Club Manager" width="56" height="56" className="login__logo-movil" />
          <h2>Ingresar</h2>
          <p className="login__ayuda">Usá el email y la contraseña que te dio el administrador.</p>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="nombre@club.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p id="errorEmail" className="text-danger small mb-0"></p>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="login__clave">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login__ver"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <p id="errorPassword" className="text-danger small mb-0"></p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger py-2" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="form-check-label">
              Recordar mi email en este equipo
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            Ingresar
          </button>

          <button
            type="button"
            className="btn btn-link w-100 mt-2 text-decoration-none"
            data-bs-toggle="modal"
            data-bs-target="#forgotPasswordModal"
          >
            Olvidé mi contraseña
          </button>
        </form>
        <Footer />
      </main>

      <div
        className="modal fade"
        id="forgotPasswordModal"
        tabIndex="-1"
        aria-labelledby="forgotPasswordModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="forgotPasswordModalLabel">
                Recuperar contraseña
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              Pedile al administrador del club que restablezca tu contraseña desde
              Usuarios. Después vas a poder cambiarla desde tu perfil.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
