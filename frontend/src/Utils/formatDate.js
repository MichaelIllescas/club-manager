// Las fechas llegan como "AAAA-MM-DD": se leen como fecha local para no correr un día
export const formatearFecha = (valor) => {
  if (!valor) return "Sin fecha";
  const [anio, mes, dia] = String(valor).slice(0, 10).split("-");
  if (!anio || !mes || !dia) return "Sin fecha";
  return `${dia}/${mes}/${anio}`;
};
