import { useState, useEffect } from "react";
import apiClient from "../Config/axiosConfig";
import TableGeneric from "../Components/TableGeneric";
import Header from "../Navbar/Header";
import Footer from "../Pages/Footer";
import DownloadReceipt from "../Components/PaymentReceiptPDF";

const PaymentHistory = () => {
  const [filter, setFilter] = useState("");
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [historyWithButton, setHistoryWithButton] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const playersResponse = await apiClient.get("/api/players");
        const membersResponse = await apiClient.get("/api/members");

        const players = playersResponse.data.map((player) => ({
          ...player,
          type: "player",
        }));

        const members = membersResponse.data.map((member) => ({
          ...member,
          type: "member",
        }));

        setPeople([...players, ...members]);
      } catch (error) {
        console.error("Error al obtener jugadores y socios:", error);
      }
    };
    fetchPeople();
  }, []);

  useEffect(() => {
    if (filter.trim() === "") {
      setFilteredPeople([]);
      return;
    }

    const filtered = people.filter((person) =>
      `${person.firstName} ${person.lastName}`
        .toLowerCase()
        .includes(filter.toLowerCase()),
    );
    setFilteredPeople(filtered);
  }, [filter, people]);

  const fetchHistory = async (id, type) => {
    try {
      const url =
        type === "player"
          ? `/api/payments/player/${id}`
          : `/api/payments/member/${id}`;
      const response = await apiClient.get(url);

      setHistory(response.data);
    } catch (error) {
      console.error("Error al obtener historial:", error);
    }
  };

  useEffect(() => {
    if (history.length > 0) {
      const historyWithDownload = history.map((payment) => ({
        ...payment,
        receipt: <DownloadReceipt payment={payment} />,
      }));
      setHistoryWithButton(historyWithDownload);
    }
  }, [history]);

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    fetchHistory(person.id, person.type);
    setFilter(`${person.firstName} ${person.lastName} DNI N° ${person.dni}`);
    setFilteredPeople([]);
  };

  return (
    <>
      <Header />
      <div className="pt-3 pb-5">
        <div className="container my-5 py-5">
          <div className="panel p-3 rounded">
            <h2>Filtrar historial de pagos de jugadores o socios</h2>
            <div className="mb-3">
              <label className="form-label">Buscar jugador o socio:</label>
              <input
                type="text"
                className="form-control w-100"
                placeholder="Ingrese nombre o apellido"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              {filteredPeople.length > 0 && (
                <ul
                  className="list-group mt-2"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {filteredPeople.map((person) => (
                    <li
                      key={person.id}
                      className="list-group-item"
                      onClick={() => handleSelectPerson(person)}
                      style={{ cursor: "pointer" }}
                    >
                      {person.type === "player" ? "Jugador" : "Socio"}:{" "}
                      {person.firstName} {person.lastName} DNI N° {person.dni}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedPerson && (
              <div className="mt-1">
                <h4>
                  Historial de {selectedPerson.firstName}{" "}
                  {selectedPerson.lastName} (
                  {selectedPerson.type === "player" ? "Jugador" : "Socio"}
                  )
                </h4>
                {
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
                    emptyMessage="Esta persona todavía no tiene pagos registrados."
                    title="Historial"
                    data={historyWithButton}
                  />
                }
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentHistory;
