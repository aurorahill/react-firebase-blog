import React from "react";
import PropTypes from "prop-types";
import classes from "./Heading.module.scss";

const Heading = ({ title }) => {
  return <h2 className={classes.heading}>{title}</h2>;
};

export default Heading;

Heading.propTypes = {
  title: PropTypes.string,
};
