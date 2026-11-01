import PaginaAlta from "../Components/PaginaAlta";
import { formatearFecha } from "../Utils/formatearFecha";
import { formatearMoneda } from "../Utils/formatearMoneda";
import "./RegistrarPago.css";
import { useState, useEffect, useRef } from "react";
import apiClient from "../Config/axiosConfig";
import DescargarComprobante from "../Components/ComprobantePagoPDF";

const RegistrarPago = () => {
  const [pago, setPago] = useState({
    fechaPago: "",
    descripcion: "",
    cuotaId: "",
    jugadorId: null,
    socioId: null,
    monto: 0,
  });

  const [cuotas, setCuotas] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [personasFiltradas, setPersonasFiltradas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("jugador");
  const [menuVisible, setMenuVisible] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pagoRegistrado, setPagoRegistrado] = useState(null); // Guardar el pago confirmado

  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestAbortController = useRef(null);

  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const response = await apiClient.get("/api/cuotas");
        setCuotas(response.data);
      } catch (error) {
        console.error("Error al obtener las cuotas:", error);
      }
    };
    fetchCuotas();
  }, []);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await apiClient.get("/api/pagos/listadoGeneral");
        setPersonas(response.data);
      } catch (error) {
        console.error("Error al obtener las personas:", error);
      }
    };
    fetchPersonas();
  }, []);

  useEffect(() => {
    if (filtroNombre.trim() === "") {
      setPersonasFiltradas([]);
      return;
    }

    const filtrados = personas.filter(
      (persona) =>
        persona.tipo === filtroTipo &&
        `${persona.nombre} ${persona.apellido}`
          .toLowerCase()
          .includes(filtroNombre.toLowerCase()),
    );
    setPersonasFiltradas(filtrados);
  }, [filtroNombre, filtroTipo, personas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPago({ ...pago, [name]: value });

    if (name === "cuotaId") {
      const cuota = cuotas.find((cuota) => cuota.id === parseInt(value));
      setPago((prevPago) => ({
        ...prevPago,
        monto: cuota ? cuota.monto : 0,
      }));
      setCuotaSeleccionada(cuota);
    }
  };

  const handleSeleccionarPersona = (persona) => {
    if (filtroTipo === "jugador") {
      setPago({ ...pago, jugadorId: persona.id, socioId: null });
    } else {
      setPago({ ...pago, socioId: persona.id, jugadorId: null });
    }
    setFiltroNombre(`${persona.nombre} ${persona.apellido}`);
    setPersonaSeleccionada(persona);
    setMenuVisible(false);
  };

  const handleAbrirModal = (e) => {
    e.preventDefault();
    if (!personaSeleccionada) {
      setMensaje("Debe seleccionar un jugador o socio antes de continuar.");
      return;
    }
    setMostrarModal(true);
  };

  const handleConfirmarPago = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    requestAbortController.current = new AbortController();

    const pagoRequest = {
      fechaPago: pago.fechaPago,
      monto: pago.monto,
      descripcion: pago.descripcion,
      cuota: { id: parseInt(pago.cuotaId) },
      jugador: pago.jugadorId ? { id: pago.jugadorId } : null,
      socio: pago.socioId ? { id: pago.socioId } : null,
    };

    try {
      const response = await apiClient.post("/api/pagos", pagoRequest, {
        signal: requestAbortController.current.signal,
      });

      // Actualizar pagoRegistrado con la respuesta completa del backend
      setPagoRegistrado({
        id: response.data.id,
        nombre: response.data.nombre,
        apellido: response.data.apellido,
        dni: response.data.dni,
        categoria: response.data.categoria,
        fechaPago: response.data.fechaPago,
        monto: response.data.monto,
        descripcion: response.data.descripcion,
        tipo: response.data.tipo,
        usuario_registro: response.data.usuario_registro,
      });

      setMensaje("Pago registrado exitosamente.");
    } catch (error) {
      setMensaje("Error al registrar el pago.");
      console.log(error);
    } finally {
      isSubmittingRef.current = false;
      setTimeout(() => setIsSubmitting(false), 300);
      requestAbortController.current = null;
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setPagoRegistrado(null); // Limpiar comprobante al cerrar modal

    // Restablecer los campos del formulario a sus valores iniciales
    setPago({
      fechaPago: "",
      descripcion: "",
      cuotaId: "",
      jugadorId: null,
      socioId: null,
      monto: 0,
    });
    setPersonaSeleccionada(null);
    setCuotaSeleccionada(null);
    setFiltroNombre("");
    setPersonasFiltradas([]);
    setMensaje("");
  };
  const handleResetSeleccion = () => {
    setPersonaSeleccionada(null);
    setPago({ ...pago, jugadorId: null, socioId: null });
    setFiltroNombre("");
  };

  return (
    <>
      <PaginaAlta
        titulo="Registrar pago"
        intro="Buscá al socio o jugador, elegí la cuota y la fecha. Antes de guardar vas a poder revisar el pago y después descargar el comprobante."
        ancha
      >
        <form onSubmit={handleAbrirModal}>
          <div className="row">
            <div className="col-lg-7 col-12">
              <div className="mb-3">
                <label className="form-label">Tipo de persona</label>
                <select
                  className="form-select w-100"
                  value={filtroTipo}
                  onChange={(e) => {
                    setFiltroTipo(e.target.value);
                    setPersonaSeleccionada(null);
                    setFiltroNombre("");
                  }}
                >
                  <option value="jugador">Jugador</option>
                  <option value="socio">Socio</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Buscar {filtroTipo}</label>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder={`Buscar ${filtroTipo}...`}
                    value={filtroNombre}
                    onChange={(e) => {
                      if (!personaSeleccionada) {
                        setFiltroNombre(e.target.value);
                        setMenuVisible(true);
                      }
                    }}
                    onFocus={() => setMenuVisible(true)}
                    onBlur={() => setTimeout(() => setMenuVisible(false), 200)}
                    disabled={!!personaSeleccionada}
                  />

                  {personaSeleccionada && (
                    <button
                      className="btn btn-danger ms-2"
                      onClick={handleResetSeleccion}
                    >
                      X
                    </button>
                  )}
                </div>

                {menuVisible && personasFiltradas.length > 0 && (
                  <ul className="dropdown-menu show">
                    {personasFiltradas.map((persona) => (
                      <li
                        key={persona.id}
                        className="dropdown-item"
                        onClick={() => handleSeleccionarPersona(persona)}
                      >
                        {persona.nombre} {persona.apellido} DNI N° {persona.dni}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de pago</label>
                <input
                  type="date"
                  name="fechaPago"
                  className="form-control w-100"
                  value={pago.fechaPago}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Observaciones</label>
                <input
                  type="text"
                  name="descripcion"
                  className="form-control w-100"
                  value={pago.descripcion}
                  onChange={handleChange}
                  placeholder="Ingrese las observaciones del pago..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Cuota</label>
                <select
                  name="cuotaId"
                  className="form-select w-100"
                  value={pago.cuotaId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una cuota</option>
                  {cuotas.map((cuota) => (
                    <option key={cuota.id} value={cuota.id}>
                      {cuota.tipo} - {formatearMoneda(cuota.monto)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-5 col-12">
              <aside className="resumen-pago" aria-live="polite">
                <h2 className="resumen-pago__titulo">Resumen del pago</h2>
                <dl>
                  <dt>Paga</dt>
                  <dd>
                    {personaSeleccionada
                      ? `${personaSeleccionada.nombre} ${personaSeleccionada.apellido}`
                      : "Elegí un socio o jugador"}
                    {personaSeleccionada && (
                      <span className="resumen-pago__detalle">
                        DNI {personaSeleccionada.dni}
                      </span>
                    )}
                  </dd>
                  <dt>Cuota</dt>
                  <dd>
                    {cuotaSeleccionada
                      ? cuotaSeleccionada.tipo
                      : "Elegí una cuota"}
                  </dd>
                  <dt>Fecha de pago</dt>
                  <dd>
                    {pago.fechaPago
                      ? formatearFecha(pago.fechaPago)
                      : "Elegí la fecha"}
                  </dd>
                  {pago.descripcion && (
                    <>
                      <dt>Observaciones</dt>
                      <dd>{pago.descripcion}</dd>
                    </>
                  )}
                </dl>
                <div className="resumen-pago__total">
                  <span>Total</span>
                  <strong>
                    {formatearMoneda(
                      cuotaSeleccionada ? cuotaSeleccionada.monto : 0,
                    )}
                  </strong>
                </div>
              </aside>
            </div>
          </div>

          <div className="alta__acciones mt-3">
            <button type="submit" className="btn btn-primary">
              Revisar y registrar
            </button>
          </div>
        </form>
      </PaginaAlta>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar pago</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCerrarModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Fecha de pago:</strong>{" "}
                  {pago.fechaPago
                    ? formatearFecha(pago.fechaPago)
                    : "No seleccionada"}
                </p>
                <p>
                  <strong>Monto:</strong> {formatearMoneda(pago.monto)}
                </p>
                <p>
                  <strong>Cuota:</strong>{" "}
                  {cuotaSeleccionada?.tipo || "No seleccionada"}
                </p>
                {personaSeleccionada && (
                  <>
                    <p>
                      <strong>Nombre:</strong> {personaSeleccionada.nombre}
                    </p>
                    <p>
                      <strong>Apellido:</strong> {personaSeleccionada.apellido}
                    </p>
                    <p>
                      <strong>DNI:</strong> {personaSeleccionada.dni}
                    </p>
                  </>
                )}
              </div>
              {mensaje && (
                <p className="mt-3 mx-4 alert alert-info text-center">
                  {mensaje}
                </p>
              )}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCerrarModal}
                >
                  Cerrar
                </button>

                {pagoRegistrado ? (
                  <div className="text-center">
                    <button className="btn">
                      <DescargarComprobante pago={pagoRegistrado} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleConfirmarPago}
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

export default RegistrarPago;
