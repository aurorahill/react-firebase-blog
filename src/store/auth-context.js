import { createContext, useContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import {
  getAuth,
  updateProfile,
  updateEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
  matchingPasswords,
} from "../utility/validate";
import {
  signOutUser,
  signInUser,
  signUpUser,
  updateUserProfile,
  getAuthInstance,
} from "../utility/firebaseService";

export const UserContext = createContext({
  user: null,
  logout: () => {},
});

export default function UserContextProvider({ children }) {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const initialErrorsState = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  };
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [errors, setErrors] = useState(initialErrorsState);
  // const auth = getAuth();
  const [state, setState] = useState(initialState);
  const { email, password, firstName, lastName, confirmPassword } = state;
  const [signUp, setSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((authUser) => {
  //     if (authUser) {
  //       setUser(authUser);
  //       if (authUser.displayName) {
  //         const [first, last] = authUser.displayName.split(" ");
  //         setState((prevState) => ({
  //           ...prevState,
  //           firstName: first || "",
  //           lastName: last || "",
  //         }));
  //       }
  //       setState((prevState) => ({
  //         ...prevState,
  //         email: authUser.email || "",
  //       }));
  //     } else {
  //       setUser(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [auth]);

  // const handleAuth = async () => {
  //   setIsLoading(true);

  //   if (
  //     errors.email ||
  //     errors.password ||
  //     errors.confirmPassword ||
  //     errors.firstName ||
  //     errors.lastName
  //   ) {
  //     toast.error("Proszę poprawić błędy w formularzu.");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     if (!signUp) {
  //       const { user } = await signInWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );
  //       setUser(user);
  //     } else {
  //       const { user } = await createUserWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );
  //       await updateProfile(user, {
  //         displayName: `${firstName} ${lastName}`,
  //       });
  //       setUser(user);
  //     }
  //   } catch (err) {
  //     toast.error(
  //       err.message || "Something went wrong. Please, try again later."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const toggleSignUp = () => {
    setSignUp((prev) => (prev = !prev));
    setState(initialState);
    setErrors(initialErrorsState);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) });
    }
    if (name === "password") {
      setErrors({ ...errors, password: validatePassword(value) });
    }
    if (name === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword: matchingPasswords(password, value),
      });
    }
    if (name === "firstName") {
      setErrors({
        ...errors,
        firstName: validateFirstName(value),
      });
    }
    if (name === "lastName") {
      setErrors({
        ...errors,
        lastName: validateLastName(value),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) });
    }
    if (name === "password") {
      setErrors({ ...errors, password: validatePassword(value) });
    }
    if (name === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword: matchingPasswords(password, value),
      });
    }
    if (name === "firstName") {
      setErrors({
        ...errors,
        firstName: validateFirstName(value),
      });
    }
    if (name === "lastName") {
      setErrors({
        ...errors,
        lastName: validateLastName(value),
      });
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    if (user) {
      const [first, last] = user.displayName.split(" ");
      setState((prevState) => ({
        ...prevState,
        firstName: first,
        lastName: last,
        email: user.email,
      }));
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setErrors(initialErrorsState);
  };

  // const handleSaveClick = async () => {
  //   if (!firstName.trim() || !lastName.trim() || !email.trim()) {
  //     toast.error("All fields are required!");
  //     return;
  //   }
  //   if (!email.includes("@")) {
  //     toast.error("Enter correct email!");
  //     return;
  //   }
  //   if (
  //     (user && `${firstName} ${lastName}` !== user.displayName) ||
  //     email !== user.email
  //   ) {
  //     const newDisplayName = `${firstName} ${lastName}`;
  //     setLoading(true);
  //     try {
  //       if (newDisplayName !== user.displayName) {
  //         await updateProfile(auth.currentUser, {
  //           displayName: newDisplayName,
  //         });
  //       }
  //       if (email !== user.email) {
  //         await updateEmail(auth.currentUser, email);
  //       }
  //       toast.success("Profile updated successfully!");
  //     } catch (error) {
  //       toast.error("Error updating profile.");
  //     } finally {
  //       setLoading(false);
  //       setEditMode(false);
  //     }
  //   }
  // };

  // const logout = async () => {
  //   try {
  //     await signOut(auth);
  //     setUser(null);
  //     setState(initialState);
  //   } catch (error) {
  //     console.error("Błąd wylogowywania:", error);
  //     toast.error("Nie udało się wylogować. Spróbuj ponownie.");
  //   }
  // };

  const auth = getAuthInstance();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        const [first, last] = authUser.displayName?.split(" ") || ["", ""];
        setState((prev) => ({
          ...prev,
          firstName: first,
          lastName: last,
          email: authUser.email || "",
        }));
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuth = async (email, password, firstName, lastName, signUp) => {
    setIsLoading(true);
    if (
      errors.email ||
      errors.password ||
      errors.confirmPassword ||
      errors.firstName ||
      errors.lastName
    ) {
      toast.error("Proszę poprawić błędy w formularzu.");
      setIsLoading(false);
      return;
    }

    try {
      let authenticatedUser;
      if (signUp) {
        authenticatedUser = await signUpUser(
          email,
          password,
          `${firstName} ${lastName}`
        );
      } else {
        authenticatedUser = await signInUser(email, password);
      }
      setUser(authenticatedUser);
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setState(initialState);
      setSignUp(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      if (!state.firstName || !state.lastName || !state.email) {
        toast.error("All fields are required!");
        return;
      }
      await updateUserProfile(
        auth.currentUser,
        `${state.firstName} ${state.lastName}`,
        state.email
      );
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ctxValue = {
    user,
    logout,
    setUser,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    editMode,
    handleBlur,
    handleChange,
    email,
    password,
    firstName,
    lastName,
    confirmPassword,
    errors,
    setErrors,
    initialState,
    setState,
    initialErrorsState,
    signUp,
    setSignUp,
    isLoading,
    handleAuth,
    toggleSignUp,
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
