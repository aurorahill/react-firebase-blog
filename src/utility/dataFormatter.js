export const dataFormatter = (timestamp) => {
  if (!timestamp) return ""; // Jeśli brak timestamp, zwróć pusty string
  return timestamp.toDate().toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long", // Pełna nazwa miesiąca
    day: "numeric",
  });
};
