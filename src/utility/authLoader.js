import { redirect } from "react-router-dom";
import { auth } from "../firebase";

export const authLoader = async () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // Odsubskrybowanie po otrzymaniu odpowiedzi
      if (!user) {
        resolve(redirect("/auth")); // Jeśli użytkownik nie jest zalogowany, przekieruj na "/"
      } else {
        resolve(user); // Jeśli zalogowany, zwróć dane użytkownika
      }
    });
  });
};
