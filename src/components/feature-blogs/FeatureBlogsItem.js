import React from "react";
import { Timestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import photoImg from "../../assets/photo.jpg";
import classes from "./FeatureBlogsItem.module.scss";
import { dataFormatter } from "../../utility/dataFormatter";

const FeatureBlogsItem = ({ item }) => {
  const navigate = useNavigate();

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
          {dataFormatter(item?.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default FeatureBlogsItem;

FeatureBlogsItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([
      PropTypes.instanceOf(Timestamp),
      PropTypes.number,
    ]).isRequired,
    imgURL: PropTypes.string,
  }).isRequired,
};
