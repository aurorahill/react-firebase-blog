import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";
import Input from "../UI/Input";
import { redirect, useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import classes from "./AuthForm.module.scss";
import { useUserContext } from "../../store/auth-context";

const AuthForm = () => {
  const {
    user,
    handleBlur,
    handleChange,
    email,
    password,
    firstName,
    lastName,
    confirmPassword,
    errors,
    signUp,
    handleAuth,
    isLoading,
  } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await handleAuth(
        email,
        password,
        firstName,
        lastName,
        signUp
      );
      if (success) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classes["auth-form"]}
    >
      {signUp && (
        <>
          <Input
            type="text"
            placeholder="Imię"
            name="firstName"
            value={firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.firstName && (
            <p className={classes.error}>{errors.firstName}</p>
          )}
          <Input
            type="text"
            placeholder="Nazwisko"
            name="lastName"
            value={lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.lastName && (
            <p className={classes.error}>{errors.lastName}</p>
          )}
        </>
      )}

      <Input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.email && <p className={classes.error}>{errors.email}</p>}
      <Input
        type="password"
        placeholder="Hasło"
        name="password"
        value={password}
        onChange={handleChange}
        minLength={6}
        onBlur={handleBlur}
      />
      {errors.password && <p className={classes.error}>{errors.password}</p>}
      {signUp && (
        <>
          <Input
            type="password"
            placeholder="Potwierdź hasło"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.confirmPassword && (
            <p className={classes.error}>{errors.confirmPassword}</p>
          )}
        </>
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
