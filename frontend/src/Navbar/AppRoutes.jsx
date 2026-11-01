import { Routes, Route } from "react-router-dom";
import { useSession } from "../Auth/useSession";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import ViewCategory from "../Categories/ViewCategories";
import RegisterCategory from "../Categories/RegisterCategory";
import UpdateCategory from "../Categories/UpdateCategory";
import ViewFees from "../Fees/ViewFees";
import RegisterFee from "../Fees/RegisterFee";
import UpdateFees from "../Fees/UpdateFeeAmounts";
import ViewMembers from "../Members/ViewMembers";
import RegisterMember from "../Members/RegisterMember";
import ChangeMemberStatus from "../Members/ChangeMemberStatus";
import ViewPlayers from "../Players/ViewPlayers";
import RegisterPlayer from "../Players/RegisterPlayer";
import ChangePlayerStatus from "../Players/ChangePlayerStatus";
import PlayersByCategory from "../Players/PlayersByCategory";
import ViewPayments from "../Payments/ViewPayments";
import RegisterPayment from "../Payments/RegisterPayment";
import PaymentHistory from "../Payments/PaymentHistory";
import PaymentsByCategory from "../Payments/PaymentsByCategory";
import PaymentsByDate from "../Payments/PaymentsByDate";
import AnnualRevenue from "../Revenue/AnnualRevenue";
import QuarterlyRevenue from "../Revenue/QuarterlyRevenue";
import ViewUsers from "../Users/ViewUsers";
import RegisterUser from "../Users/RegisterUser";
import ChangeUserStatus from "../Users/ChangeUserStatus";
import ViewProfile from "../Users/ViewProfile";
import ChangePassword from "../Users/ChangePassword";
import NotFound from "../Pages/NotFound";

// Routes available to any logged-in user
const ROUTES = [
  { path: "/inicio", element: <Home /> },
  { path: "/socios", element: <ViewMembers /> },
  { path: "/socios/nuevo", element: <RegisterMember /> },
  { path: "/socios/estado", element: <ChangeMemberStatus /> },
  { path: "/jugadores", element: <ViewPlayers /> },
  { path: "/jugadores/nuevo", element: <RegisterPlayer /> },
  { path: "/jugadores/estado", element: <ChangePlayerStatus /> },
  { path: "/jugadores/por-categoria", element: <PlayersByCategory /> },
  { path: "/categorias", element: <ViewCategory /> },
  { path: "/categorias/editar", element: <UpdateCategory /> },
  { path: "/cuotas", element: <ViewFees /> },
  { path: "/pagos", element: <ViewPayments /> },
  { path: "/pagos/nuevo", element: <RegisterPayment /> },
  { path: "/pagos/por-persona", element: <PaymentHistory /> },
  { path: "/pagos/por-categoria", element: <PaymentsByCategory /> },
  { path: "/pagos/por-fecha", element: <PaymentsByDate /> },
  { path: "/perfil", element: <ViewProfile /> },
  { path: "/perfil/clave", element: <ChangePassword /> },
];

// Admin-only routes (the backend restricts them too)
const ADMIN_ROUTES = [
  { path: "/categorias/nueva", element: <RegisterCategory /> },
  { path: "/cuotas/nueva", element: <RegisterFee /> },
  { path: "/cuotas/montos", element: <UpdateFees /> },
  { path: "/recaudaciones/anuales", element: <AnnualRevenue /> },
  { path: "/recaudaciones/trimestrales", element: <QuarterlyRevenue /> },
  { path: "/usuarios", element: <ViewUsers /> },
  { path: "/usuarios/nuevo", element: <RegisterUser /> },
  { path: "/usuarios/estado", element: <ChangeUserStatus /> },
];

const AppRoutes = () => {
  const { role, loading } = useSession();
  const routes = role === "ADMIN" ? [...ROUTES, ...ADMIN_ROUTES] : ROUTES;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      {/* While the session loads, the user's routes are not known yet */}
      <Route path="*" element={loading ? null : <NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
