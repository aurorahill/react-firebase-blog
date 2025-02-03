import React, { useState } from "react";
import ResetPassword from "../components/auth/ResetPassword";
import classes from "./Auth.module.scss";
import AuthForm from "../components/auth/AuthForm";
import Heading from "../components/UI/Heading";
import { useUserContext } from "../store/auth-context";

const Auth = () => {
  const [showModal, setShowModal] = useState(false);
  const { signUp, toggleSignUp } = useUserContext();

  return (
    <div className={classes.auth}>
      <Heading title={!signUp ? "Zaloguj się" : "Zarejestruj się"} />
      <AuthForm signUp={signUp} />

      <div className={classes.auth__actions}>
        {!signUp ? (
          <>
            <p>
              Nie masz jeszcze konta?&nbsp;
              <span
                className={classes["sign-up"]}
                onClick={toggleSignUp}
              >
                Zarejestruj się
              </span>
            </p>
            <p
              className={classes["reset-password"]}
              onClick={() => setShowModal(true)}
            >
              Zapomniałeś hasła?&nbsp;
            </p>
          </>
        ) : (
          <p>
            Masz już konto?&nbsp;
            <span
              className={classes["sign-in"]}
              onClick={toggleSignUp}
            >
              Zaloguj się
            </span>
          </p>
        )}
      </div>

      {showModal && (
        <ResetPassword
          onClose={() => setShowModal(false)}
          open={showModal}
        />
      )}
    </div>
  );
};

export default Auth;
