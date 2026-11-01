import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import TableGeneric from "../Components/TableGeneric";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import DownloadReceipt from "../Components/PaymentReceiptPDF";

const PaymentsByDate = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [payments, setPayments] = useState([]);
  const [paymentsWithButton, setPaymentsWithButton] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let url = "/api/payments/by-period?";
      if (selectedYear) url += `year=${selectedYear}&`;
      if (selectedMonth) url += `month=${selectedMonth}&`;
      if (selectedDay) url += `day=${selectedDay}`;

      url = url.endsWith("&") ? url.slice(0, -1) : url;

      const response = await apiClient.get(url);
      setPayments(response.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, selectedMonth, selectedYear]);

  useEffect(() => {
    if (payments.length > 0) {
      const paymentsWithDownload = payments.map((payment) => ({
        ...payment,
        receipt: <DownloadReceipt payment={payment} />,
      }));
      setPaymentsWithButton(paymentsWithDownload);
    }
  }, [payments]);

  return (
    <>
      <Header />
      <div className="pt-3 pb-3">
        <div className="container my-5 py-5">
          <div className="panel p-4 rounded">
            <h2>Historial de pagos por fecha</h2>

            <div className="mb-3">
              <label className="form-label">Seleccionar año:</label>
              <select
                className="form-select w-100"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Todos los años</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={2025 + i} value={2025 + i}>
                    {2025 + i}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Seleccionar mes:</label>
              <select
                className="form-select w-100"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Todos los meses</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("es", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Seleccionar día:</label>
              <select
                className="form-select w-100"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">Todos los días</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p>Cargando pagos...</p>
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
                emptyMessage="No hay pagos en el período elegido."
                title="Pagos encontrados"
                data={paymentsWithButton}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentsByDate;
