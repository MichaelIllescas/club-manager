import Footer from "../Pages/Footer";
import Header from "../Navbar/Header";
import TableGeneric from "../Components/TableGeneric";
import SummaryStrip from "../Components/SummaryStrip";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../Config/axiosConfig";
import { useSession } from "../Auth/useSession";
import { formatCurrency } from "../Utils/formatCurrency";
import { formatDate } from "../Utils/formatDate";

const ViewFees = () => {
  const { role } = useSession();
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesResponse, paymentsResponse] = await Promise.all([
          apiClient.get("/api/fees"),
          apiClient.get("/api/payments/details").catch(() => ({ data: [] })),
        ]);
        setFees(feesResponse.data);
        setPayments(Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []);
      } catch (err) {
        console.error("Error al obtener las cuotas:", err);
        setError("No se pudieron cargar las cuotas. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // How many payments each fee has and how much it collected
  const rows = fees.map((fee) => {
    const feePayments = payments.filter((payment) => payment.feeName === fee.name);
    const collected = feePayments.reduce((total, payment) => total + Number(payment.amount || 0), 0);
    return {
      id: fee.id,
      name: fee.name,
      amount: formatCurrency(fee.amount),
      payments: feePayments.length,
      collected: formatCurrency(collected),
      lastUpdated: formatDate(fee.lastUpdated),
    };
  });

  const highestFee = fees.reduce((max, fee) => (fee.amount > (max?.amount ?? -1) ? fee : max), null);
  const totalCollected = payments.reduce((total, payment) => total + Number(payment.amount || 0), 0);

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
            <SummaryStrip
              data={[
                { label: "Cuotas registradas", value: fees.length },
                {
                  label: highestFee ? `Cuota más alta (${highestFee.name})` : "Cuota más alta",
                  value: highestFee ? formatCurrency(highestFee.amount) : "—",
                },
                { label: "Recaudado con todas las cuotas", value: formatCurrency(totalCollected) },
              ]}
            />
            <TableGeneric
              columns={["id", "name", "amount", "payments", "collected", "lastUpdated"]}
              emptyMessage="Todavía no hay cuotas registradas."
              title="Cuotas"
              data={rows}
              primaryAction={
                role === "ADMIN" && (
                  <Link to="/cuotas/nueva" className="btn btn-primary">
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

export default ViewFees;
