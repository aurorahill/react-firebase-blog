import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export const UserContext = createContext({
  user: null,
  logout: () => {},
});

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
    });
  };

  const ctxValue = {
    user,
    logout,
    setUser,
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
