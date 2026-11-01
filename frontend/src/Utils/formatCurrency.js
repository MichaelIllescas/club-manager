// Formato argentino: 13.531.750,00 (punto para miles, coma para decimales)
export const formatearNumero = (valor) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(valor) || 0);

export const formatearMoneda = (valor) => `$${formatearNumero(valor)}`;
