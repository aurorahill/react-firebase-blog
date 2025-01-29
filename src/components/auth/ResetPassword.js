import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

import Modal from "../UI/Modal";
import Input from "../UI/Input";
import Button from "../UI/Button";
import classes from "./ResetPassword.module.scss";
import Heading from "../UI/Heading";

const ResetPassword = ({ onClose, open }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const auth = getAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email can not be empty.");
      return;
    }
    setIsPending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("An email with a link to reset your password has been sent.");
      setEmail("");
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classes.reset}>
        <Heading title="Zresetuj hasło" />
        <form onSubmit={handleResetPassword}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNameInput={classes.input}
          />
          <div className={classes.reset__actives}>
            <Button
              onClick={onClose}
              textOnly
              className={classes.button}
              type="button"
            >
              Zamknij
            </Button>
            <Button
              className={classes.button}
              disabled={isPending}
            >
              {isPending ? "Wysyłanie..." : "Wyślij"}
            </Button>
          </div>
        </form>
        <p className={classes.reset__message}>{message}</p>
      </div>
    </Modal>
  );
};

export default ResetPassword;
