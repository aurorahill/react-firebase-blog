import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../store/auth-context";
import Button from "../UI/Button";
import classes from "./CommentBox.module.scss";
import { useDetailContext } from "../../store/datail-context";
import { db } from "../../firebase";
import { doc, Timestamp, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

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
  const { user } = useUserContext();
  const userId = user?.uid;
  const navigate = useNavigate();

  const handleComment = async (e) => {
    e.preventDefault();
    if (userComment.length >= 15 && userComment.length <= 300) {
      setSendingComment(true);
      comments.push({
        createdAt: Timestamp.fromDate(new Date()),
        userId: user?.uid,
        name: user?.displayName,
        body: userComment,
      });

      try {
        await updateDoc(doc(db, "blogs", id), {
          ...blog,
          comments,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.log(err);
      }
      toast.success("Comment posted successfully");
      setComments(comments);
      setUserComment("");
      setSendingComment(false);
    } else {
      toast.error("Comment has contain 15-300 characters");
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
    </form>
  );
};

export default CommentBox;
