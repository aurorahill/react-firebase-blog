import React from "react";
import Header from "../components/Header";
import classes from "./NotFound.module.scss";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className={classes.error}>
        <h1 className={classes.error__header}>NotFound</h1>
        <p className={classes.error__text}>
          Sorry, we don't have this page in our resources.
        </p>
        <p>
          Visit our <Link>home page</Link>
        </p>
      </div>
      <p>footer</p>
    </>
  );
};

export default NotFound;
