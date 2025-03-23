import React from "react";
import classes from "./Spinner.module.scss";

const Spinner = () => {
  return (
    <div className={classes.spinner}>
      <div className={classes.spinner__circle}></div>
      <p className={classes.spinner__text}>Loading...</p>
    </div>
  );
};

export default Spinner;
