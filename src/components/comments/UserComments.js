import React from "react";
import { Timestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import classes from "./UserComments.module.scss";
import { useUserContext } from "../../store/auth-context";
import Button from "../UI/Button";
import { useDetailContext } from "../../store/datail-context";

import { dataFormatter } from "../../utility/dataFormatter";

const UserComments = ({ name, body, createdAt, msg, userId, id }) => {
  const { user } = useUserContext();
  const { sendingComment, handleCommentDelete } = useDetailContext();

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
                  onClick={() => handleCommentDelete(createdAt, id)}
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

UserComments.propTypes = {
  name: PropTypes.string,
  body: PropTypes.string,
  createdAt: PropTypes.oneOfType([
    PropTypes.instanceOf(Timestamp),
    PropTypes.number,
  ]),
  msg: PropTypes.string,
  userId: PropTypes.string,
  id: PropTypes.string,
};
