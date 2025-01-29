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
          Przepraszamy, taka strona nie istnieje.
        </p>
        <p>
          Odwiedź naszą <Link>stronę główną</Link>
        </p>
      </div>
      <p>footer</p>
    </>
  );
};

export default NotFound;
