import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../store/auth-context";
import Button from "../UI/Button";
import classes from "./CommentBox.module.scss";
import { useDetailContext } from "../../store/datail-context";

import Modal from "../UI/Modal";

const CommentBox = ({ id }) => {
  const {
    userComment,
    setUserComment,
    sendingComment,
    handleSendingComment,
    error,
    setError,
  } = useDetailContext();

  const { user } = useUserContext();
  const userId = user?.uid;
  const navigate = useNavigate();

  return (
    <form className={classes["comment-form"]}>
      <div className={classes["comment-form__box"]}>
        <textarea
          rows="4"
          minLength="15"
          maxLength="300"
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
        />
      </div>
      <div className={classes["comment-form__actions"]}>
        {!userId ? (
          <>
            <p className={classes["comment-form__msg"]}>
              By skomentować zaloguj się lub utwórz konto.
            </p>
            <Button
              type="button"
              onClick={() => navigate("/auth")}
            >
              Zaloguj
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={(e) => handleSendingComment(e, id, user)}
              disabled={sendingComment}
            >
              {sendingComment ? "Wysyłanie..." : "Skomentuj"}
            </Button>
          </>
        )}
      </div>
      {error && (
        <Modal
          open={!!error}
          onClose={() => {
            setError(null);
          }}
          error="Błąd podczas wysyłania danych"
          message={error}
        />
      )}
    </form>
  );
};

export default CommentBox;
