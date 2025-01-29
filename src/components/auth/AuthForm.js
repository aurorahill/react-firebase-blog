import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";
import Input from "../UI/Input";
import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import classes from "./AuthForm.module.scss";
import { useUserContext } from "../../store/auth-context";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const AuthForm = ({ signUp }) => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserContext();

  const { email, password, firstName, lastName, confirmPassword } = state;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!signUp) {
        if (email.trim() && password.trim()) {
          const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          setUser(user);
          navigate("/");
        } else {
          return toast.error("All fields are mandatory to fill");
        }
      } else {
        if (password !== confirmPassword) {
          return toast.error("Password don't match");
        }
        if (password.length < 6) {
          return toast.error("Password requires at least 6 characters.");
        }
        if (
          firstName.trim() &&
          lastName.trim() &&
          email.trim() &&
          password.trim()
        ) {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });
        } else {
          return toast.error("All fields are mandatory to fill");
        }
      }
      navigate("/");
    } catch (err) {
      toast.error(
        err.message || "Something went wrong. Please, try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleAuth}>
      {signUp && (
        <>
          <Input
            type="text"
            placeholder="Imię"
            name="firstName"
            value={firstName}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="Nazwisko"
            name="lastName"
            value={lastName}
            onChange={handleChange}
          />
        </>
      )}

      <Input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={handleChange}
      />
      <Input
        type="password"
        placeholder="Hasło"
        name="password"
        value={password}
        onChange={handleChange}
        minLength={6}
      />
      {signUp && (
        <Input
          type="password"
          placeholder="Potwierdź hasło"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
        />
      )}
      <div>
        <Button
          className={`${
            !signUp ? classes["btn-sign-in"] : classes["btn-sign-up"]
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Czekaj..." : !signUp ? "Zaloguj się" : "Zarejstruj się"}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
