import React from "react";
import PropTypes from "prop-types";
import classes from "./ScrollWrapper.module.scss";

const ScrollWrapper = ({ children, className }) => {
  return (
    <div
      className={className ? `${classes.scroll} ${className}` : classes.scroll}
    >
      {children}
    </div>
  );
};

export default ScrollWrapper;

ScrollWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
