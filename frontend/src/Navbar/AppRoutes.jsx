import { Routes, Route } from "react-router-dom";
import { useSession } from "../Auth/useSession";
import Login from "../Index/Login";
import Inicio from "../Index/Index";
import VerCategoria from "../Categoria/VerCategoria";
import RegistrarCategoria from "../Categoria/RegistrarCategoria";
import ActualizarCategoria from "../Categoria/ActualizarCategoria";
import VerCuotas from "../Cuotas/VerCuotas";
import RegistrarCuota from "../Cuotas/RegistrarCuota";
import ActualizarCuotas from "../Cuotas/ActualizarCuotas";
import VerSocios from "../Socios/VerSocios";
import RegistrarSocio from "../Socios/RegistrarSocio";
import CambiarEstadoSocio from "../Socios/CambiarEstadoSocio";
import VerJugadores from "../Jugadores/VerJugadores";
import RegistrarJugador from "../Jugadores/RegistrarJugador";
import CambiarEstadoJugador from "../Jugadores/CambiarEstadoJugador";
import ListadoDeJugadores from "../Jugadores/ListadoDeJugadores";
import VerPagosGeneral from "../Pagos/VerPagosGeneral";
import RegistrarPago from "../Pagos/RegistrarPago";
import FiltrarHistorial from "../Pagos/FiltrarHistorial";
import FiltrarPagosPorCategoria from "../Pagos/FiltrarPagosPorCategoria";
import PagosPorPeriodo from "../Pagos/PagosPorPeriodo";
import RecaudacionesAnuales from "../Recaudaciones/RecaudacionesAnuales";
import VerRecaudacionesTrimestrales from "../Recaudaciones/VerRecaudacionesTrimestrales";
import VerUsuarios from "../Usuarios/VerUsuarios";
import RegistrarUsuario from "../Usuarios/RegistrarUsuario";
import CambiarEstadoUsuario from "../Usuarios/CambiarEstadoUsuario";
import VerPerfil from "../Usuarios/VerPerfil";
import CambiarClave from "../Usuarios/CambiarClave";
import NoEncontrada from "../Index/NoEncontrada";

// Rutas disponibles para cualquier usuario logueado
const RUTAS = [
  { path: "/inicio", element: <Inicio /> },
  { path: "/socios", element: <VerSocios /> },
  { path: "/socios/nuevo", element: <RegistrarSocio /> },
  { path: "/socios/estado", element: <CambiarEstadoSocio /> },
  { path: "/jugadores", element: <VerJugadores /> },
  { path: "/jugadores/nuevo", element: <RegistrarJugador /> },
  { path: "/jugadores/estado", element: <CambiarEstadoJugador /> },
  { path: "/jugadores/por-categoria", element: <ListadoDeJugadores /> },
  { path: "/categorias", element: <VerCategoria /> },
  { path: "/categorias/editar", element: <ActualizarCategoria /> },
  { path: "/cuotas", element: <VerCuotas /> },
  { path: "/pagos", element: <VerPagosGeneral /> },
  { path: "/pagos/nuevo", element: <RegistrarPago /> },
  { path: "/pagos/por-persona", element: <FiltrarHistorial /> },
  { path: "/pagos/por-categoria", element: <FiltrarPagosPorCategoria /> },
  { path: "/pagos/por-fecha", element: <PagosPorPeriodo /> },
  { path: "/perfil", element: <VerPerfil /> },
  { path: "/perfil/clave", element: <CambiarClave /> },
];

// Rutas que sólo ve el administrador (el backend también las restringe)
const RUTAS_ADMIN = [
  { path: "/categorias/nueva", element: <RegistrarCategoria /> },
  { path: "/cuotas/nueva", element: <RegistrarCuota /> },
  { path: "/cuotas/montos", element: <ActualizarCuotas /> },
  { path: "/recaudaciones/anuales", element: <RecaudacionesAnuales /> },
  { path: "/recaudaciones/trimestrales", element: <VerRecaudacionesTrimestrales /> },
  { path: "/usuarios", element: <VerUsuarios /> },
  { path: "/usuarios/nuevo", element: <RegistrarUsuario /> },
  { path: "/usuarios/estado", element: <CambiarEstadoUsuario /> },
];

const Rutas = () => {
  const { rol, cargando } = useSession();
  const rutas = rol === "ADMIN" ? [...RUTAS, ...RUTAS_ADMIN] : RUTAS;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {rutas.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      {/* Mientras carga la sesión todavía no se sabe qué rutas tiene el usuario */}
      <Route path="*" element={cargando ? null : <NoEncontrada />} />
    </Routes>
  );
};

export default Rutas;
