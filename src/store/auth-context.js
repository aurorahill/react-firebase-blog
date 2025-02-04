import { createContext, useContext, useState, useEffect } from "react";
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
  deleteUser,
  deleteUserBlogs,
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
  const [state, setState] = useState(initialState);
  const { email, password, firstName, lastName, confirmPassword } = state;
  const [signUp, setSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuthInstance();

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

  const deleteUserAndBlogs = async (userId) => {
    if (
      window.confirm(
        "Czy na pewno chcesz usunąć swoje konto i wszystkie swoje blogi?"
      )
    ) {
      setIsLoading(true);
      try {
        await deleteUserBlogs(userId);
        await deleteUser();
        setState(initialState);
        toast.success("Użytkownik i blogi zostały usunięte.");
      } catch (error) {
        console.error("Błąd podczas usuwania:", error);
        toast.error("Nie udało się usunąć konta. Spróbuj ponownie później.");
      } finally {
        setIsLoading(false);
      }
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
    deleteUserAndBlogs,
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
