import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import CountUp from "react-countup";
import Header from "../Navbar/Header";
import Footer from "./Footer";
import RevenueChart from "./RevenueChart";
import { useSession } from "../Auth/useSession";
import { Link } from "react-router-dom";
import "./Home.css";

function App() {
  const { role: role, user } = useSession();


  const [dashboardData, setDashboardData] = useState({
    playerCount: 0,
    memberCount: 0,
    totalRevenue: 0,
    activeCategories: 0,
    chartData: [],
  });

  useEffect(() => {
    apiClient.get("/api/dashboard")
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del backend:", error);
      });
  }, []);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion ? 0 : 1.2;

  const shortcuts = [
    { to: "/pagos/nuevo", icon: "fa-hand-holding-usd", text: "Registrar pago" },
    { to: "/socios/nuevo", icon: "fa-user-plus", text: "Registrar socio" },
    { to: "/jugadores/nuevo", icon: "fa-running", text: "Registrar jugador" },
    { to: "/pagos", icon: "fa-list", text: "Ver pagos" },
  ];

  return (
    <>
      <Header />

      <main className="container home">
        <div className="home__header">
          <h1>Hola{user?.firstName ? `, ${user.firstName}` : ""}</h1>
          <p>Este es el estado del club hoy.</p>
        </div>

        {role === "ADMIN" && (
          <section className="scoreboard" aria-label="Resumen del club">
            <div className="scoreboard__item">
              <span className="scoreboard__value">
                <CountUp start={0} end={dashboardData.memberCount} duration={duration} />
              </span>
              <span className="scoreboard__label">Socios</span>
            </div>
            <div className="scoreboard__item">
              <span className="scoreboard__value">
                <CountUp start={0} end={dashboardData.playerCount} duration={duration} />
              </span>
              <span className="scoreboard__label">Jugadores</span>
            </div>
            <div className="scoreboard__item">
              <span className="scoreboard__value">
                <CountUp start={0} end={dashboardData.activeCategories} duration={duration} />
              </span>
              <span className="scoreboard__label">Categorías</span>
            </div>
            <div className="scoreboard__item scoreboard__item--total">
              <span className="scoreboard__value">
                $<CountUp
                  start={0}
                  end={dashboardData.totalRevenue}
                  duration={duration}
                  separator="."
                  decimal=","
                  decimals={2}
                />
              </span>
              <span className="scoreboard__label">Recaudado</span>
            </div>
          </section>
        )}

        <div className="row g-4">
          <div className={role === "ADMIN" ? "col-lg-8" : "col-12"}>
            {role === "ADMIN" ? (
              <section className="panel p-4 h-100">
                <h2 className="home__title">Recaudación por mes</h2>
                <RevenueChart data={dashboardData.chartData} />
              </section>
            ) : (
              <section className="panel p-4">
                <h2 className="home__title">¿Qué querés hacer?</h2>
                <p className="text-secondary mb-0">
                  Elegí una tarea de la lista o usá el menú de arriba para ver todas las secciones.
                </p>
              </section>
            )}
          </div>
          <div className={role === "ADMIN" ? "col-lg-4" : "col-12"}>
            <section className="panel p-4 h-100">
              <h2 className="home__title">Accesos rápidos</h2>
              <nav className="shortcuts">
                {shortcuts.map((shortcut) => (
                  <Link key={shortcut.to} to={shortcut.to} className="shortcuts__item">
                    <i className={`fas ${shortcut.icon}`} aria-hidden="true"></i>
                    {shortcut.text}
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
