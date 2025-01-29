import React from "react";
import classes from "./UserComments.module.scss";
import { useUserContext } from "../../store/auth-context";
import { toast } from "react-toastify";
import Button from "../UI/Button";
import { useDetailContext } from "../../store/datail-context";
import { db } from "../../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { dataFormatter } from "../../utility/dataFormatter";

const UserComments = ({ name, body, createdAt, msg, userId, id }) => {
  const { user } = useUserContext();
  const { setSendingComment, comments, setComments, sendingComment } =
    useDetailContext();

  const handleCommentDelete = async (createdAt) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten komentarz?")) {
      try {
        setSendingComment(true);
        const updatedComments = comments.filter(
          (comment) => comment.createdAt.seconds !== createdAt.seconds
        );
        await updateDoc(doc(db, "blogs", id), {
          comments: updatedComments,
          timestamp: serverTimestamp(),
        });

        setComments(updatedComments);
        toast.success("Komentarz usunięty!");
      } catch (err) {
        console.error("Error deleting comment:", err);
        toast.error(
          "Nie udało się usunąć komentarza. Spróbuj ponownie póżniej."
        );
      } finally {
        setSendingComment(false);
      }
    }
  };

  return (
    <div className={classes["user-comments"]}>
      {msg ? (
        <h4 className={classes["user-comments__msg"]}>{msg}</h4>
      ) : (
        <article className={classes["comment-item"]}>
          <div className={classes["comment-item__image"]}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User"
            />
          </div>
          <div className={classes["comment-item__content"]}>
            <h3 className={classes["comment-item__title"]}>
              {name} <span>{dataFormatter(createdAt)}</span>
            </h3>
            <p className={classes["comment-item__body"]}>{body}</p>
            {user?.uid && userId === user?.uid && (
              <div className={classes["comment-item__delete"]}>
                <Button
                  className={classes["comment-item__btn"]}
                  textOnly
                  onClick={() => handleCommentDelete(createdAt)}
                  disabled={sendingComment}
                  title="Delete"
                >
                  {sendingComment ? "Usuwanie..." : "Usuń"}
                </Button>
              </div>
            )}
          </div>
        </article>
      )}
    </div>
  );
};

export default UserComments;
