import FormPage from "../Components/FormPage";
import { formatDate } from "../Utils/formatDate";
import { formatCurrency } from "../Utils/formatCurrency";
import "./RegisterPayment.css";
import { useState, useEffect, useRef } from "react";
import apiClient from "../Config/axiosConfig";
import DownloadReceipt from "../Components/PaymentReceiptPDF";

// Text shown to the user for each person type
const PERSON_LABELS = { player: "jugador", member: "socio" };

const RegisterPayment = () => {
  const [payment, setPayment] = useState({
    paymentDate: "",
    description: "",
    feeId: "",
    playerId: null,
    memberId: null,
    amount: 0,
  });

  const [fees, setFees] = useState([]);
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("player");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [registeredPayment, setRegisteredPayment] = useState(null);

  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestAbortController = useRef(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await apiClient.get("/api/fees");
        setFees(response.data);
      } catch (error) {
        console.error("Error al obtener las cuotas:", error);
      }
    };
    fetchFees();
  }, []);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await apiClient.get("/api/payments/people");
        setPeople(response.data);
      } catch (error) {
        console.error("Error al obtener las personas:", error);
      }
    };
    fetchPeople();
  }, []);

  useEffect(() => {
    if (nameFilter.trim() === "") {
      setFilteredPeople([]);
      return;
    }

    const filtered = people.filter(
      (person) =>
        person.type === typeFilter &&
        `${person.firstName} ${person.lastName}`
          .toLowerCase()
          .includes(nameFilter.toLowerCase()),
    );
    setFilteredPeople(filtered);
  }, [nameFilter, typeFilter, people]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });

    if (name === "cuotaId") {
      const fee = fees.find((fee) => fee.id === parseInt(value));
      setPayment((prevPayment) => ({
        ...prevPayment,
        amount: fee ? fee.amount : 0,
      }));
      setSelectedFee(fee);
    }
  };

  const handleSelectPerson = (person) => {
    if (typeFilter === "player") {
      setPayment({ ...payment, playerId: person.id, memberId: null });
    } else {
      setPayment({ ...payment, memberId: person.id, playerId: null });
    }
    setNameFilter(`${person.firstName} ${person.lastName}`);
    setSelectedPerson(person);
    setMenuVisible(false);
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!selectedPerson) {
      setMessage("Debe seleccionar un jugador o socio antes de continuar.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    requestAbortController.current = new AbortController();

    const paymentRequest = {
      paymentDate: payment.paymentDate,
      amount: payment.amount,
      description: payment.description,
      fee: { id: parseInt(payment.feeId) },
      player: payment.playerId ? { id: payment.playerId } : null,
      member: payment.memberId ? { id: payment.memberId } : null,
    };

    try {
      const response = await apiClient.post("/api/payments", paymentRequest, {
        signal: requestAbortController.current.signal,
      });

      setRegisteredPayment({
        id: response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        dni: response.data.dni,
        category: response.data.category,
        paymentDate: response.data.paymentDate,
        amount: response.data.amount,
        description: response.data.description,
        feeName: response.data.feeName,
        registeredBy: response.data.registeredBy,
      });

      setMessage("Pago registrado exitosamente.");
    } catch (error) {
      setMessage("Error al registrar el pago.");
      console.log(error);
    } finally {
      isSubmittingRef.current = false;
      setTimeout(() => setIsSubmitting(false), 300);
      requestAbortController.current = null;
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRegisteredPayment(null);

    setPayment({
      paymentDate: "",
      description: "",
      feeId: "",
      playerId: null,
      memberId: null,
      amount: 0,
    });
    setSelectedPerson(null);
    setSelectedFee(null);
    setNameFilter("");
    setFilteredPeople([]);
    setMessage("");
  };
  const handleResetSelection = () => {
    setSelectedPerson(null);
    setPayment({ ...payment, playerId: null, memberId: null });
    setNameFilter("");
  };

  return (
    <>
      <FormPage
        title="Registrar pago"
        intro="Buscá al socio o jugador, elegí la cuota y la fecha. Antes de guardar vas a poder revisar el pago y después descargar el comprobante."
        wide
      >
        <form onSubmit={handleOpenModal}>
          <div className="row">
            <div className="col-lg-7 col-12">
              <div className="mb-3">
                <label className="form-label">Tipo de persona</label>
                <select
                  className="form-select w-100"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setSelectedPerson(null);
                    setNameFilter("");
                  }}
                >
                  <option value="player">Jugador</option>
                  <option value="member">Socio</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Buscar {PERSON_LABELS[typeFilter]}</label>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder={`Buscar ${PERSON_LABELS[typeFilter]}...`}
                    value={nameFilter}
                    onChange={(e) => {
                      if (!selectedPerson) {
                        setNameFilter(e.target.value);
                        setMenuVisible(true);
                      }
                    }}
                    onFocus={() => setMenuVisible(true)}
                    onBlur={() => setTimeout(() => setMenuVisible(false), 200)}
                    disabled={!!selectedPerson}
                  />

                  {selectedPerson && (
                    <button
                      className="btn btn-danger ms-2"
                      onClick={handleResetSelection}
                    >
                      X
                    </button>
                  )}
                </div>

                {menuVisible && filteredPeople.length > 0 && (
                  <ul className="dropdown-menu show">
                    {filteredPeople.map((person) => (
                      <li
                        key={person.id}
                        className="dropdown-item"
                        onClick={() => handleSelectPerson(person)}
                      >
                        {person.firstName} {person.lastName} DNI N° {person.dni}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de pago</label>
                <input
                  type="date"
                  name="paymentDate"
                  className="form-control w-100"
                  value={payment.paymentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Observaciones</label>
                <input
                  type="text"
                  name="description"
                  className="form-control w-100"
                  value={payment.description}
                  onChange={handleChange}
                  placeholder="Ingrese las observaciones del pago..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Cuota</label>
                <select
                  name="feeId"
                  className="form-select w-100"
                  value={payment.feeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una cuota</option>
                  {fees.map((fee) => (
                    <option key={fee.id} value={fee.id}>
                      {fee.name} - {formatCurrency(fee.amount)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-5 col-12">
              <aside className="payment-summary" aria-live="polite">
                <h2 className="payment-summary__title">Resumen del pago</h2>
                <dl>
                  <dt>Paga</dt>
                  <dd>
                    {selectedPerson
                      ? `${selectedPerson.firstName} ${selectedPerson.lastName}`
                      : "Elegí un socio o jugador"}
                    {selectedPerson && (
                      <span className="payment-summary__detail">
                        DNI {selectedPerson.dni}
                      </span>
                    )}
                  </dd>
                  <dt>Cuota</dt>
                  <dd>
                    {selectedFee
                      ? selectedFee.name
                      : "Elegí una cuota"}
                  </dd>
                  <dt>Fecha de pago</dt>
                  <dd>
                    {payment.paymentDate
                      ? formatDate(payment.paymentDate)
                      : "Elegí la fecha"}
                  </dd>
                  {payment.description && (
                    <>
                      <dt>Observaciones</dt>
                      <dd>{payment.description}</dd>
                    </>
                  )}
                </dl>
                <div className="payment-summary__total">
                  <span>Total</span>
                  <strong>
                    {formatCurrency(
                      selectedFee ? selectedFee.amount : 0,
                    )}
                  </strong>
                </div>
              </aside>
            </div>
          </div>

          <div className="form-page__actions mt-3">
            <button type="submit" className="btn btn-primary">
              Revisar y registrar
            </button>
          </div>
        </form>
      </FormPage>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar pago</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Fecha de pago:</strong>{" "}
                  {payment.paymentDate
                    ? formatDate(payment.paymentDate)
                    : "No seleccionada"}
                </p>
                <p>
                  <strong>Monto:</strong> {formatCurrency(payment.amount)}
                </p>
                <p>
                  <strong>Cuota:</strong>{" "}
                  {selectedFee?.name || "No seleccionada"}
                </p>
                {selectedPerson && (
                  <>
                    <p>
                      <strong>Nombre:</strong> {selectedPerson.firstName}
                    </p>
                    <p>
                      <strong>Apellido:</strong> {selectedPerson.lastName}
                    </p>
                    <p>
                      <strong>DNI:</strong> {selectedPerson.dni}
                    </p>
                  </>
                )}
              </div>
              {message && (
                <p className="mt-3 mx-4 alert alert-info text-center">
                  {message}
                </p>
              )}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>

                {registeredPayment ? (
                  <div className="text-center">
                    <button className="btn">
                      <DownloadReceipt payment={registeredPayment} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleConfirmPayment}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registrando..." : "Confirmar"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPayment;
