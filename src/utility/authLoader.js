import { redirect } from "react-router-dom";
import { auth } from "../firebase";

export const authLoader = async () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // Odsubskrybowanie po otrzymaniu odpowiedzi
      if (!user) {
        resolve(redirect("/auth"));
      } else {
        resolve(user);
      }
    });
  });
};
