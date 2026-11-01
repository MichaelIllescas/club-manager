import Footer from "../Index/Footer";
import Header from "../Navbar/Header";
import TableGeneric from "/src/Components/TableGeneric";
import ResumenLista from "../Components/ResumenLista";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../Config/axiosConfig";
import { useSession } from "../Auth/useSession";
import { formatearMoneda } from "../Utils/formatearMoneda";
import { formatearFecha } from "../Utils/formatearFecha";

const VerCuotas = () => {
  const { rol } = useSession();
  const [cuotas, setCuotas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [respuestaCuotas, respuestaPagos] = await Promise.all([
          apiClient.get("/api/cuotas"),
          apiClient.get("/api/pagos/listadoGeneralPagos").catch(() => ({ data: [] })),
        ]);
        setCuotas(respuestaCuotas.data);
        setPagos(Array.isArray(respuestaPagos.data) ? respuestaPagos.data : []);
      } catch (err) {
        console.error("Error al obtener las cuotas:", err);
        setError("No se pudieron cargar las cuotas. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  // Cuántos pagos tiene cada cuota y cuánto se recaudó con ella
  const filas = cuotas.map((cuota) => {
    const pagosDeLaCuota = pagos.filter((pago) => pago.tipo === cuota.tipo);
    const recaudado = pagosDeLaCuota.reduce((total, pago) => total + Number(pago.monto || 0), 0);
    return {
      id: cuota.id,
      tipo: cuota.tipo,
      monto: formatearMoneda(cuota.monto),
      pagos: pagosDeLaCuota.length,
      recaudado: formatearMoneda(recaudado),
      actualizada: formatearFecha(cuota.fechaUltimaActualizacion),
    };
  });

  const masAlta = cuotas.reduce((max, cuota) => (cuota.monto > (max?.monto ?? -1) ? cuota : max), null);
  const recaudadoTotal = pagos.reduce((total, pago) => total + Number(pago.monto || 0), 0);

  return (
    <>
      <Header />
      <main className="container pb-5">
        {loading ? (
          <p className="mt-4">Cargando cuotas...</p>
        ) : error ? (
          <div className="alert alert-danger mt-4">{error}</div>
        ) : (
          <>
            <ResumenLista
              datos={[
                { nombre: "Cuotas registradas", valor: cuotas.length },
                {
                  nombre: masAlta ? `Cuota más alta (${masAlta.tipo})` : "Cuota más alta",
                  valor: masAlta ? formatearMoneda(masAlta.monto) : "—",
                },
                { nombre: "Recaudado con todas las cuotas", valor: formatearMoneda(recaudadoTotal) },
              ]}
            />
            <TableGeneric
              columnas={["id", "tipo", "monto", "pagos", "recaudado", "actualizada"]}
              mensajeVacio="Todavía no hay cuotas registradas."
              titulo="Cuotas"
              data={filas}
              accionPrincipal={
                rol === "ADMIN" && (
                  <Link to="/registrarCuota" className="btn btn-primary">
                    <i className="fas fa-plus me-2" aria-hidden="true"></i>Nueva cuota
                  </Link>
                )
              }
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default VerCuotas;
