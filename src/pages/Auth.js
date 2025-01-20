import React, { useState } from "react";
import ResetPassword from "../components/ResetPassword";
import classes from "./Auth.module.scss";
import AuthForm from "../components/AuthForm";
import Heading from "../components/UI/Heading";

const Auth = () => {
  const [signUp, setSignUp] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={classes.auth}>
      <Heading title={!signUp ? "Sign-In" : "Sign-Up"} />
      <AuthForm signUp={signUp} />

      <div className={classes.auth__actions}>
        {!signUp ? (
          <>
            <p>
              Don't have an account?&nbsp;
              <span
                className={classes["sign-up"]}
                onClick={() => setSignUp(true)}
              >
                Sign Up
              </span>
            </p>
            <p
              className={classes["reset-password"]}
              onClick={() => setShowModal(true)}
            >
              Forgot your password?&nbsp;
            </p>
          </>
        ) : (
          <p>
            Already have an account?&nbsp;
            <span
              className={classes["sign-in"]}
              onClick={() => setSignUp(false)}
            >
              Sign In
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
