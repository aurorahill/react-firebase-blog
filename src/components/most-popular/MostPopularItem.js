import React from "react";
import { useNavigate } from "react-router-dom";
import photoImg from "../../assets/photo.jpg";
import classes from "./MostPopularItem.module.scss";

const MostPopularItem = ({ item }) => {
  const navigate = useNavigate();

  if (!item || !item.timestamp) {
    return <p>Loading...</p>;
  }
  return (
    <div
      className={classes.popular}
      onClick={() => navigate(`/detail/${item.id}`)}
    >
      <div className={classes.popular__image}>
        <img
          src={item.imgURL || photoImg}
          alt={item.title}
        />
      </div>
      <div className={classes.popular__content}>
        <p className={classes.popular__title}>{item.title}</p>
        <p className={classes.popular__date}>
          {item.timestamp.toDate().toDateString()}
        </p>
      </div>
    </div>
  );
};

export default MostPopularItem;
