import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import classes from "./SectionHeader.module.scss";
import Button from "./Button";

const SectionHeader = ({ children, className, backButton }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className={classes.header}>
      <h2
        className={
          className
            ? `${classes.header__title} ${className}`
            : classes.header__title
        }
      >
        {children}
      </h2>
      {backButton && (
        <Button
          textOnly
          className={classes.header__button}
          onClick={handleBack}
        >
          Back
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;

SectionHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  backButton: PropTypes.bool,
};
