import { isEmpty } from "lodash";
import React from "react";
import UserComments from "./UserComments";
import classes from "./Comments.module.scss";
import { useDetailContext } from "../../store/datail-context";

const Comments = ({ id }) => {
  const { comments } = useDetailContext();
  return (
    <section className={classes.comments}>
      <h4 className={classes.comments__title}>
        {comments?.length} {comments?.length === 1 ? "Comment" : "Comments"}
      </h4>
      {isEmpty(comments) ? (
        <UserComments msg="No comment posted on this blog yet." />
      ) : (
        <>
          {comments?.map((comment) => (
            <UserComments
              {...comment}
              id={id}
              key={`${comment.createdAt}-${comment.userId}`}
            />
          ))}
        </>
      )}
    </section>
  );
};

export default Comments;
