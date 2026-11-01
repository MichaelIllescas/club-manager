// Dates arrive as "YYYY-MM-DD": read them as local dates so they do not shift by a day
export const formatDate = (value) => {
  if (!value) return "Sin fecha";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  if (!year || !month || !day) return "Sin fecha";
  return `${day}/${month}/${year}`;
};
