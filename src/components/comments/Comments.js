import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import UserComments from "./UserComments";
import classes from "./Comments.module.scss";
import { useDetailContext } from "../../store/datail-context";
import ScrollWrapper from "../UI/ScrollWrapper";

const Comments = ({ id }) => {
  const { comments } = useDetailContext();
  let content;
  if (comments?.length === 0) {
    content = "komentarzy";
  } else if (comments?.length === 1) {
    content = "komentarz";
  } else if (comments?.length > 1 && comments?.length < 5) {
    content = "komentarze";
  } else if (comments?.length >= 5) {
    content = "komentarzy";
  }
  return (
    <section className={classes.comments}>
      <ScrollWrapper>
        <h4 className={classes.comments__title}>
          {comments?.length} {content}
        </h4>
        {isEmpty(comments) ? (
          <UserComments msg="Ten wpis nie ma jeszcze komentarzy" />
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
      </ScrollWrapper>
    </section>
  );
};

export default Comments;

Comments.propTypes = {
  id: PropTypes.string.isRequired,
};
