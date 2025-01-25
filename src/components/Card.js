import React from "react";
import { Link } from "react-router-dom";
import classes from "./Card.module.scss";
import { shortText } from "../utility/shortText";

const Card = ({ title, id, description, imgURL }) => {
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
          <span>Read more</span>
        </Link>
        <div>{/* {show like} */}like</div>
      </div>
    </div>
  );
};

export default Card;
