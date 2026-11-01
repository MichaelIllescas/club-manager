import { useState, useEffect } from "react";
import Footer from "../Pages/Footer";
import Header from "../Navbar/Header";
import TableGeneric from "../Components/TableGeneric";
import apiClient from "../Config/axiosConfig";
import DownloadReceipt from "../Components/PaymentReceiptPDF";

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

  // The backend only fills `category` for player payments; for members it is empty
  const isPlayerPayment = (payment) => Boolean(payment.category?.trim());

  const filteredPayments =
    typeFilter === "all"
      ? payments
      : payments.filter(
          (payment) => isPlayerPayment(payment) === (typeFilter === "player"),
        );

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await apiClient.get("/api/payments/details");

        // Newest first (sorted before the date is formatted)
        const sorted = [...response.data].sort(
          (a, b) =>
            new Date(b.paymentDate) - new Date(a.paymentDate) ||
            (b.id ?? 0) - (a.id ?? 0),
        );

        const formattedPayments = sorted.map((payment) => ({
          ...payment,
          paymentDate: formatDate(payment.paymentDate),
          receipt: <DownloadReceipt payment={payment} />,
        }));

        setPayments(formattedPayments);
      } catch (err) {
        console.error("Error al obtener los pagos:", err);
        setError("No se pudieron cargar los pagos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-content-center py-2">
        <div className="mt-3 py-5 mb-5 pb-5">
          {loading ? (
            <p className="text-center">Cargando cuotas...</p>
          ) : error ? (
            <p className="text-center text-danger">{error}</p>
          ) : (
            <TableGeneric
              columns={[
                "id",
                "firstName",
                "lastName",
                "dni",
                "category",
                "paymentDate",
                "amount",
                "description",
                "feeName",
                "registeredBy",
                "receipt",
              ]}
              emptyMessage="Todavía no hay pagos registrados."
              key={typeFilter}
              title={"Pagos registrados"}
              data={filteredPayments}
              filters={
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">Pagos de:</h5>
                  <select
                    id="typeFilter"
                    className="form-select w-auto"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="player">Jugadores</option>
                    <option value="member">Socios</option>
                  </select>
                </div>
              }
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewPayments;
