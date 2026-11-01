import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import CountUp from "react-countup";
import Header from "../Navbar/Header";
import Footer from "/src/index/Footer";
import GraficoIndex from "/src/index/Grafico"; // Asegúrate de que la ruta sea correcta
import { getCookie } from "../Auth/cookieUtils";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/img/logo.svg";

function App() {


   // Obtener el valor de la cookie "authToken"
      const token = getCookie("authToken");
  
      // Decodificar el token para obtener el rol del usuario
      let role = null;
      if (token) {
        const decoded = jwtDecode(token); // Uso correcto de jwtDecode
        role = decoded.role; // Ajusta según tu JWT
      }


  const [dashboardData, setDashboardData] = useState({
    cantidadJugadores: 0,
    cantidadSocios: 0,
    recaudacionTotal: 0,
    categoriasActivas: 0,
    graficoData: [],
  });

  useEffect(() => {
    // Llamada al backend para obtener datos
    apiClient.get("/api/dashboard") // Cambia la URL si es necesario
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del backend:", error);
      });
  }, []);

  return (
    <>
      <Header />

      {role === "ADMIN" ? (
        <div className="mt-3 pt-1 pb-5 mb-5">
          <div className="container mt-5 pt-5 pb-5">
            <div className="row">
              {/* Columna de tarjetas */}
              <div className="col-lg-4">
                {/* Cantidad de jugadores */}
                <div className="card border-left-primary shadow mb-4">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Cantidad de jugadores
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          <CountUp start={0} end={dashboardData.cantidadJugadores} duration={2} />
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-users fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cantidad de socios */}
                <div className="card border-left-success shadow mb-4">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Cantidad de socios
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          <CountUp start={0} end={dashboardData.cantidadSocios} duration={2} />
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-id-card fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recaudación total */}
                <div className="card border-left-info shadow mb-4">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                          Recaudación total
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          $<CountUp start={0} end={dashboardData.recaudacionTotal} duration={2} separator="." decimal="," decimals={2} />
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipos activos */}
                <div className="card border-left-warning shadow mb-4">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                          Categorías activas
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          <CountUp start={0} end={dashboardData.categoriasActivas} duration={2} />
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-futbol fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico a la derecha */}
              <div className="col-lg-8">
                <div className="card shadow mb-4 text-center">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between text-center">
                    <h6 className="m-0 font-weight-bold text-primary text-center">Resumen general</h6>
                  </div>
                  <div className="card-body">
                    <GraficoIndex data={dashboardData.graficoData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 pt-1 pb-5 mb-5">
          <div className="container mt-5 pt-5 pb-5">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow text-center py-5">
                  <div className="card-body">
                    <img
                      src={logo}
                      alt="Logo Club Manager"
                      className="mb-4"
                      style={{ maxWidth: "200px", height: "auto" }}
                    />
                    <h2 className="text-primary font-weight-bold mb-3">
                      Bienvenido al Sistema de Gestión
                    </h2>
                    <p className="text-muted lead">
                      Club Manager
                    </p>
                    <hr className="my-4" />
                    <p className="text-secondary">
                      Utiliza el menú de navegación para acceder a las diferentes secciones del sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default App;
