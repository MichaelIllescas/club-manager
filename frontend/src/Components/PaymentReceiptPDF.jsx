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
import { formatCurrency } from "../Utils/formatCurrency";
import { formatDate } from "../Utils/formatDate";

// Theme colors
const FIELD_GREEN = "#1f5e3b";
const FIELD_GREEN_LIGHT = "#e6efe8";
const CREST_GOLD = "#e0a731";
const INK = "#172a22";
const INK_SOFT = "#5b6a62";
const LINE = "#d9e0d6";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK,
    backgroundColor: "#ffffff",
  },

  // Header: green band with the crest, the title and the number
  header: {
    backgroundColor: FIELD_GREEN,
    color: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderBottomWidth: 4,
    borderBottomColor: CREST_GOLD,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  brandText: {
    marginLeft: 10,
  },
  club: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
  },
  documentLabel: {
    fontSize: 9,
    color: "#d6e4da",
    marginTop: 2,
  },
  numberBox: {
    alignItems: "flex-end",
  },
  numberLabel: {
    fontSize: 8,
    color: "#d6e4da",
  },
  number: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    marginTop: 2,
  },

  body: {
    paddingHorizontal: 28,
    paddingTop: 22,
    flexGrow: 1,
  },

  label: {
    fontSize: 8,
    color: INK_SOFT,
    marginBottom: 3,
  },
  personName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
  },
  personDetails: {
    flexDirection: "row",
    marginTop: 4,
    color: INK_SOFT,
  },
  separator: {
    marginHorizontal: 6,
    color: LINE,
  },

  detail: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  rowLabel: {
    width: "38%",
    color: INK_SOFT,
  },
  rowValue: {
    width: "62%",
    fontFamily: "Helvetica-Bold",
  },

  total: {
    marginTop: 18,
    backgroundColor: FIELD_GREEN_LIGHT,
    borderLeftWidth: 4,
    borderLeftColor: FIELD_GREEN,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: FIELD_GREEN,
  },
  totalAmount: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: INK,
  },

  // "Paid" stamp, tilted like a rubber stamp
  stamp: {
    position: "absolute",
    right: 34,
    top: 118,
    borderWidth: 2.5,
    borderColor: FIELD_GREEN,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    transform: "rotate(-12deg)",
    opacity: 0.85,
  },
  stampText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: FIELD_GREEN,
    letterSpacing: 2,
  },

  pie: {
    marginHorizontal: 28,
    marginBottom: 22,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: LINE,
    borderTopStyle: "dashed",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: INK_SOFT,
  },
});


const receiptNumber = (id) => (id ? String(id).padStart(6, "0") : "------");

// Club crest drawn with react-pdf primitives (it cannot embed an SVG image)
const Crest = () => (
  <Svg width={30} height={30} viewBox="0 0 120 120">
    <Path d="M60 6 104 22v34c0 29-19 49-44 58C35 105 16 85 16 56V22Z" fill="#ffffff" stroke={CREST_GOLD} strokeWidth={7} />
    <Path d="M16 46h88" stroke={FIELD_GREEN} strokeWidth={4} />
  </Svg>
);

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

Row.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

export const PaymentReceiptPDF = ({ payment }) => {
  const firstName = [payment.firstName, payment.lastName].filter(Boolean).join(" ") || "Sin nombre";

  return (
    <Document title={`Comprobante de pago ${receiptNumber(payment.id)}`} author="Club Manager">
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <Crest />
            <View style={styles.brandText}>
              <Text style={styles.club}>Club Manager</Text>
              <Text style={styles.documentLabel}>Comprobante de pago</Text>
            </View>
          </View>
          <View style={styles.numberBox}>
            <Text style={styles.numberLabel}>N° de comprobante</Text>
            <Text style={styles.number}>{receiptNumber(payment.id)}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>Recibimos de</Text>
          <Text style={styles.personName}>{firstName}</Text>
          <View style={styles.personDetails}>
            <Text>DNI {payment.dni || "sin informar"}</Text>
            {payment.category ? (
              <>
                <Text style={styles.separator}>|</Text>
                <Text>Categoría {payment.category}</Text>
              </>
            ) : null}
          </View>

          <View style={styles.detail}>
            <Row label="Concepto" value={payment.feeName || "Sin especificar"} />
            <Row label="Fecha de pago" value={formatDate(payment.paymentDate)} />
            {payment.description ? <Row label="Observaciones" value={payment.description} /> : null}
          </View>

          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total pagado</Text>
            <Text style={styles.totalAmount}>{formatCurrency(payment.amount)}</Text>
          </View>
        </View>

        <View style={styles.stamp}>
          <Text style={styles.stampText}>PAGADO</Text>
        </View>

        <View style={styles.pie}>
          <Text>Registrado por {payment.registeredBy || "sin informar"}</Text>
          <Text>Conservá este comprobante</Text>
        </View>
      </Page>
    </Document>
  );
};

PaymentReceiptPDF.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dni: PropTypes.string,
    category: PropTypes.string,
    paymentDate: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    description: PropTypes.string,
    feeName: PropTypes.string,
    registeredBy: PropTypes.string,
  }).isRequired,
};

// Button that generates and downloads the receipt
const DownloadReceipt = ({ payment }) => {
  if (!payment) return null;

  return (
    <PDFDownloadLink
      document={<PaymentReceiptPDF payment={payment} />}
      fileName={`comprobante_${receiptNumber(payment.id)}.pdf`}
      className="btn btn-sm btn-secondary"
      title="Descargar comprobante de pago"
      aria-label="Descargar comprobante de pago"
    >
      {({ loading }) => (loading ? "Generando..." : <FaDownload size={14} />)}
    </PDFDownloadLink>
  );
};

DownloadReceipt.propTypes = {
  payment: PaymentReceiptPDF.propTypes.payment,
};

export default DownloadReceipt;
