import React from "react";
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
