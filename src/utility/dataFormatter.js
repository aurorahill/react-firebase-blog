import { Timestamp } from "firebase/firestore";

export const dataFormatter = (timestamp) => {
  if (!timestamp) return ""; // Jeśli brak timestamp, zwróć pusty string
  const date =
    timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);

  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long", // Pełna nazwa miesiąca
    day: "numeric",
  });
};
