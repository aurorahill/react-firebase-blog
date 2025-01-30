import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../store/auth-context";
import Button from "../UI/Button";
import classes from "./CommentBox.module.scss";
import { useDetailContext } from "../../store/datail-context";
import { db } from "../../firebase";
import { doc, Timestamp, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import Modal from "../UI/Modal";

const CommentBox = ({ id }) => {
  const {
    userComment,
    setUserComment,
    sendingComment,
    setComments,
    comments,
    setSendingComment,
    blog,
  } = useDetailContext();
  const [error, setError] = useState(null);
  const { user } = useUserContext();
  const userId = user?.uid;
  const navigate = useNavigate();

  const handleComment = async (e) => {
    e.preventDefault();
    if (userComment.length >= 15 && userComment.length <= 300) {
      setSendingComment(true);

      try {
        await updateDoc(doc(db, "blogs", id), {
          ...blog,
          comments,
          timestamp: serverTimestamp(),
        });
        comments.push({
          createdAt: Timestamp.fromDate(new Date()),
          userId: user?.uid,
          name: user?.displayName,
          body: userComment,
        });
        toast.success("Skomentowałeś post!");
        setComments(comments);
        setUserComment("");
      } catch (err) {
        console.log(err);
        setError(
          err.message ||
            "Błąd podczas zapisywanie komentarza. Spróbuj ponownie później."
        );
      } finally {
        setSendingComment(false);
      }
    } else {
      toast.error("Komentarz musi zawierać 15-300 znaków.");
    }
  };
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
              onClick={handleComment}
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
