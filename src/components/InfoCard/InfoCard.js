import React from "react";
import PropTypes from "prop-types";
import classes from "./InfoCard.module.scss";

const InfoCard = ({ title, children }) => {
  return (
    <div className={classes.card}>
      <h3 className={classes.card__title}>{title}</h3>
      <div className={classes.card__text}>{children}</div>
    </div>
  );
};

export default InfoCard;

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
