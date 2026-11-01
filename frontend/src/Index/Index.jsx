import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import CountUp from "react-countup";
import Header from "../Navbar/Header";
import Footer from "/src/index/Footer";
import GraficoIndex from "/src/index/Grafico"; // Asegúrate de que la ruta sea correcta
import { useSession } from "../Auth/useSession";
import { Link } from "react-router-dom";
import "./Inicio.css";

function App() {
  const { rol: role, usuario } = useSession();


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

  const sinAnimacion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const duracion = sinAnimacion ? 0 : 1.2;

  const accesos = [
    { to: "/registrarPago", icono: "fa-hand-holding-usd", texto: "Registrar pago" },
    { to: "/RegistrarSocio", icono: "fa-user-plus", texto: "Registrar socio" },
    { to: "/registrarJugador", icono: "fa-running", texto: "Registrar jugador" },
    { to: "/ListadoPagosGeneral", icono: "fa-list", texto: "Ver pagos" },
  ];

  return (
    <>
      <Header />

      <main className="container inicio">
        <div className="inicio__encabezado">
          <h1>Hola{usuario?.nombre ? `, ${usuario.nombre}` : ""}</h1>
          <p>Este es el estado del club hoy.</p>
        </div>

        {role === "ADMIN" && (
          <section className="marcador" aria-label="Resumen del club">
            <div className="marcador__dato">
              <span className="marcador__valor">
                <CountUp start={0} end={dashboardData.cantidadSocios} duration={duracion} />
              </span>
              <span className="marcador__nombre">Socios</span>
            </div>
            <div className="marcador__dato">
              <span className="marcador__valor">
                <CountUp start={0} end={dashboardData.cantidadJugadores} duration={duracion} />
              </span>
              <span className="marcador__nombre">Jugadores</span>
            </div>
            <div className="marcador__dato">
              <span className="marcador__valor">
                <CountUp start={0} end={dashboardData.categoriasActivas} duration={duracion} />
              </span>
              <span className="marcador__nombre">Categorías</span>
            </div>
            <div className="marcador__dato marcador__dato--total">
              <span className="marcador__valor">
                $<CountUp
                  start={0}
                  end={dashboardData.recaudacionTotal}
                  duration={duracion}
                  separator="."
                  decimal=","
                  decimals={2}
                />
              </span>
              <span className="marcador__nombre">Recaudado</span>
            </div>
          </section>
        )}

        <div className="row g-4">
          <div className={role === "ADMIN" ? "col-lg-8" : "col-12"}>
            {role === "ADMIN" ? (
              <section className="panel p-4 h-100">
                <h2 className="inicio__titulo">Recaudación por mes</h2>
                <GraficoIndex data={dashboardData.graficoData} />
              </section>
            ) : (
              <section className="panel p-4">
                <h2 className="inicio__titulo">¿Qué querés hacer?</h2>
                <p className="text-secondary mb-0">
                  Elegí una tarea de la lista o usá el menú de arriba para ver todas las secciones.
                </p>
              </section>
            )}
          </div>
          <div className={role === "ADMIN" ? "col-lg-4" : "col-12"}>
            <section className="panel p-4 h-100">
              <h2 className="inicio__titulo">Accesos rápidos</h2>
              <nav className="accesos">
                {accesos.map((acceso) => (
                  <Link key={acceso.to} to={acceso.to} className="accesos__item">
                    <i className={`fas ${acceso.icono}`} aria-hidden="true"></i>
                    {acceso.texto}
                  </Link>
                ))}
              </nav>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;
