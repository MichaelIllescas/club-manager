// Argentine format: 13.531.750,00 (dot for thousands, comma for decimals)
export const formatNumber = (value) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const formatCurrency = (value) => `$${formatNumber(value)}`;
