import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import TableGeneric from "../Components/TableGeneric";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";

const PaymentsByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // The backend needs all three filters to work out who paid and who owes
    if (!selectedCategory || !selectedMonth || !selectedYear) {
      setFilteredPayments([]);
      return;
    }

    const fetchFilteredPayments = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/payments/status", {
          params: {
            categoryId: selectedCategory,
            month: selectedMonth,
            year: selectedYear,
          },
        });
        setFilteredPayments(response.data);
      } catch (error) {
        console.error("Error al filtrar pagos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPayments();
  }, [selectedCategory, selectedMonth, selectedYear]);

  return (
    <>
      <Header />
      <div className="pt-3">
        <div className="container my-5 py-5">
          <div className="panel p-4 rounded">
            <h2>Filtrar pagos</h2>
            <div className="mb-3">
              <label className="form-label">Seleccionar categoría:</label>
              <select
                className="form-select w-100"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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
                <option value="" disabled>
                  Selecciona un meses
                </option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("es", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Seleccionar año:</label>
              <select
                className="form-select w-100"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona el año
                </option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = 2025 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {loading ? (
              <p>Cargando pagos...</p>
            ) : (
              <TableGeneric
                columns={["firstName", "lastName", "dni", "status"]}
                emptyMessage={
                  selectedCategory && selectedMonth && selectedYear
                    ? "No hay jugadores activos en esa categoría."
                    : "Elegí una categoría, un mes y un año para ver quién pagó y quién debe."
                }
                title="Pagos encontrados"
                data={filteredPayments}
                actions={[]}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentsByCategory;
