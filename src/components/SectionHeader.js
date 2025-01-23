import React from "react";
import classes from "./SectionHeader.module.scss";

const SectionHeader = ({ children, className }) => {
  return (
    <h2
      className={className ? `${classes.header} ${className}` : classes.header}
    >
      {children}
    </h2>
  );
};

export default SectionHeader;
