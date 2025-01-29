// import { createContext, useContext, useState, useEffect } from "react";
// import { auth } from "../firebase";
// import { signOut } from "firebase/auth";

// export const UserContext = createContext({
//   user: null,
//   logout: () => {},
// });

// export default function UserContextProvider({ children }) {
//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     auth.onAuthStateChanged((authUser) => {
//       if (authUser) {
//         setUser(authUser);
//       } else {
//         setUser(null);
//       }
//     });
//   }, []);

//   const logout = () => {
//     signOut(auth).then(() => {
//       setUser(null);
//     });
//   };

//   const ctxValue = {
//     user,
//     logout,
//     setUser,
//   };

//   return (
//     <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
//   );
// }

// export const useUserContext = () => useContext(UserContext);

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { toast } from "react-toastify";

export const UserContext = createContext({
  user: null,
  logout: () => {},
});

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        if (authUser.displayName) {
          const [first, last] = authUser.displayName.split(" ");
          setFirstName(first || "");
          setLastName(last || "");
        }
        setNewEmail(authUser.email || "");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleEditClick = () => {
    setEditMode(true);
    if (user) {
      const [first, last] = user.displayName.split(" ");
      setFirstName(first);
      setLastName(last);
      setNewEmail(user.email);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleSaveClick = async () => {
    if (!firstName.trim() || !lastName.trim() || !newEmail.trim()) {
      toast.error("All fields are required!");
      return;
    }
    if (!newEmail.includes("@")) {
      toast.error("Enter correct email!");
      return;
    }
    if (
      (user && `${firstName} ${lastName}` !== user.displayName) ||
      newEmail !== user.email
    ) {
      const newDisplayName = `${firstName} ${lastName}`;
      setLoading(true);
      try {
        if (newDisplayName !== user.displayName) {
          await updateProfile(auth.currentUser, {
            displayName: newDisplayName,
          });
        }
        if (newEmail !== user.email) {
          await updateEmail(auth.currentUser, newEmail);
        }
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Error updating profile.");
      } finally {
        setLoading(false);
      }
    } else {
      setEditMode(false);
    }
  };

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
    });
  };

  const ctxValue = {
    user,
    logout,
    setUser,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    editMode,
    firstName,
    lastName,
    newEmail,
    setFirstName,
    setLastName,
    setNewEmail,
    loading,
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
