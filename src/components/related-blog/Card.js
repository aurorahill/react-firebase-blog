import React from "react";
import PropTypes, { arrayOf } from "prop-types";
import { Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import classes from "./Card.module.scss";
import { shortText } from "../../utility/shortText";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";

const Card = ({ title, id, description, imgURL, likes, comments }) => {
  return (
    <div className={classes.card}>
      <img
        src={imgURL}
        alt={title}
        className={classes.card__img}
      />
      <h3 className={classes.card__title}>{title}</h3>
      <p className={classes.card__text}>{shortText(description, 25)}</p>
      <div className={classes.card__footer}>
        <Link to={`/detail/${id}`}>
          <span>Czytaj więcej</span>
        </Link>
        <div className={classes.card__popular}>
          <span className={classes.card__icon}>
            <FaRegThumbsUp /> {likes.length}
          </span>
          <span className={classes.card__icon}>
            <FaRegComment /> {comments.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;

Card.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  description: PropTypes.string,
  imgURL: PropTypes.string,
  likes: PropTypes.arrayOf(PropTypes.string),
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      createdAt: PropTypes.instanceOf(Timestamp).isRequired,
      name: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })
  ),
};
