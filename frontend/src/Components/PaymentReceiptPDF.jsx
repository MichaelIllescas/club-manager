import PropTypes from "prop-types";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { FaDownload } from "react-icons/fa";
import { formatearMoneda } from "../Utils/formatearMoneda";
import { formatearFecha } from "../Utils/formatearFecha";

// Colores del tema de la aplicación
const CANCHA = "#1f5e3b";
const CANCHA_CLARO = "#e6efe8";
const ESCUDO = "#e0a731";
const TINTA = "#172a22";
const TINTA_SUAVE = "#5b6a62";
const LINEA = "#d9e0d6";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: TINTA,
    backgroundColor: "#ffffff",
  },

  // Encabezado: banda verde con el escudo, el título y el número
  encabezado: {
    backgroundColor: CANCHA,
    color: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderBottomWidth: 4,
    borderBottomColor: ESCUDO,
  },
  marca: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  marcaTextos: {
    marginLeft: 10,
  },
  club: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
  },
  documento: {
    fontSize: 9,
    color: "#d6e4da",
    marginTop: 2,
  },
  numeroCaja: {
    alignItems: "flex-end",
  },
  numeroEtiqueta: {
    fontSize: 8,
    color: "#d6e4da",
  },
  numero: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    marginTop: 2,
  },

  cuerpo: {
    paddingHorizontal: 28,
    paddingTop: 22,
    flexGrow: 1,
  },

  // Quién pagó
  etiqueta: {
    fontSize: 8,
    color: TINTA_SUAVE,
    marginBottom: 3,
  },
  nombre: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
  },
  datosPersona: {
    flexDirection: "row",
    marginTop: 4,
    color: TINTA_SUAVE,
  },
  separador: {
    marginHorizontal: 6,
    color: LINEA,
  },

  // Detalle del pago
  detalle: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: LINEA,
  },
  fila: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: LINEA,
  },
  filaEtiqueta: {
    width: "38%",
    color: TINTA_SUAVE,
  },
  filaValor: {
    width: "62%",
    fontFamily: "Helvetica-Bold",
  },

  // Total
  total: {
    marginTop: 18,
    backgroundColor: CANCHA_CLARO,
    borderLeftWidth: 4,
    borderLeftColor: CANCHA,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalEtiqueta: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: CANCHA,
  },
  totalMonto: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: TINTA,
  },

  // Sello "Pagado", inclinado como un sello de goma
  sello: {
    position: "absolute",
    right: 34,
    top: 118,
    borderWidth: 2.5,
    borderColor: CANCHA,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    transform: "rotate(-12deg)",
    opacity: 0.85,
  },
  selloTexto: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: CANCHA,
    letterSpacing: 2,
  },

  pie: {
    marginHorizontal: 28,
    marginBottom: 22,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: LINEA,
    borderTopStyle: "dashed",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: TINTA_SUAVE,
  },
});


const numeroComprobante = (id) => (id ? String(id).padStart(6, "0") : "------");

// Escudo del club dibujado con primitivas de react-pdf (no admite SVG como imagen)
const Escudo = () => (
  <Svg width={30} height={30} viewBox="0 0 120 120">
    <Path d="M60 6 104 22v34c0 29-19 49-44 58C35 105 16 85 16 56V22Z" fill="#ffffff" stroke={ESCUDO} strokeWidth={7} />
    <Path d="M16 46h88" stroke={CANCHA} strokeWidth={4} />
  </Svg>
);

const Fila = ({ etiqueta, valor }) => (
  <View style={styles.fila}>
    <Text style={styles.filaEtiqueta}>{etiqueta}</Text>
    <Text style={styles.filaValor}>{valor}</Text>
  </View>
);

Fila.propTypes = {
  etiqueta: PropTypes.string.isRequired,
  valor: PropTypes.node,
};

export const ComprobantePagoPDF = ({ pago }) => {
  const nombre = [pago.nombre, pago.apellido].filter(Boolean).join(" ") || "Sin nombre";

  return (
    <Document title={`Comprobante de pago ${numeroComprobante(pago.id)}`} author="Club Manager">
      <Page size="A5" style={styles.page}>
        <View style={styles.encabezado}>
          <View style={styles.marca}>
            <Escudo />
            <View style={styles.marcaTextos}>
              <Text style={styles.club}>Club Manager</Text>
              <Text style={styles.documento}>Comprobante de pago</Text>
            </View>
          </View>
          <View style={styles.numeroCaja}>
            <Text style={styles.numeroEtiqueta}>N° de comprobante</Text>
            <Text style={styles.numero}>{numeroComprobante(pago.id)}</Text>
          </View>
        </View>

        <View style={styles.cuerpo}>
          <Text style={styles.etiqueta}>Recibimos de</Text>
          <Text style={styles.nombre}>{nombre}</Text>
          <View style={styles.datosPersona}>
            <Text>DNI {pago.dni || "sin informar"}</Text>
            {pago.categoria ? (
              <>
                <Text style={styles.separador}>|</Text>
                <Text>Categoría {pago.categoria}</Text>
              </>
            ) : null}
          </View>

          <View style={styles.detalle}>
            <Fila etiqueta="Concepto" valor={pago.tipo || "Sin especificar"} />
            <Fila etiqueta="Fecha de pago" valor={formatearFecha(pago.fechaPago)} />
            {pago.descripcion ? <Fila etiqueta="Observaciones" valor={pago.descripcion} /> : null}
          </View>

          <View style={styles.total}>
            <Text style={styles.totalEtiqueta}>Total pagado</Text>
            <Text style={styles.totalMonto}>{formatearMoneda(pago.monto)}</Text>
          </View>
        </View>

        <View style={styles.sello}>
          <Text style={styles.selloTexto}>PAGADO</Text>
        </View>

        <View style={styles.pie}>
          <Text>Registrado por {pago.usuario_registro || "sin informar"}</Text>
          <Text>Conservá este comprobante</Text>
        </View>
      </Page>
    </Document>
  );
};

ComprobantePagoPDF.propTypes = {
  pago: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    dni: PropTypes.string,
    categoria: PropTypes.string,
    fechaPago: PropTypes.string,
    monto: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    descripcion: PropTypes.string,
    tipo: PropTypes.string,
    usuario_registro: PropTypes.string,
  }).isRequired,
};

// Botón que genera y descarga el comprobante
const DescargarComprobante = ({ pago }) => {
  if (!pago) return null;

  return (
    <PDFDownloadLink
      document={<ComprobantePagoPDF pago={pago} />}
      fileName={`comprobante_${numeroComprobante(pago.id)}.pdf`}
      className="btn btn-sm btn-secondary"
      title="Descargar comprobante de pago"
      aria-label="Descargar comprobante de pago"
    >
      {({ loading }) => (loading ? "Generando..." : <FaDownload size={14} />)}
    </PDFDownloadLink>
  );
};

DescargarComprobante.propTypes = {
  pago: ComprobantePagoPDF.propTypes.pago,
};

export default DescargarComprobante;
