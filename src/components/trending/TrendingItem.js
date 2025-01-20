import React from "react";
import { Link } from "react-router-dom";
import photoImg from "../../assets/photo.png";
import classes from "./TrendingItem.module.scss";

const TrendingItem = ({ item }) => {
  return (
    <>
      <Link to={`/detail/${item.id}`}>
        <div className={classes.trending}>
          <div className={classes.trending__hero}>
            <img
              src={item.imgURL || photoImg}
              alt={item.title}
            />
          </div>
          <div className={classes.trending__hero1}></div>
          <div className={classes.trending__content}>
            <p className={classes.trending__title}>{item.title}</p>
            <p className={classes.trending__text}>
              <span>{item.author}</span>&nbsp;|&nbsp;
              <span>{item.timestamp.toDate().toDateString()}</span>
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default TrendingItem;
