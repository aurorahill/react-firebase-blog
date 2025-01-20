import React from "react";
import classes from "./SectionHeader.module.scss";

const SectionHeader = ({ children }) => {
  return <h2 className={classes.header}>{children}</h2>;
};

export default SectionHeader;
