import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import classes from "./Root.module.scss";

const RootLayout = () => {
  return (
    <>
      <Header />
      <main className={classes.main}>
        <Outlet />
      </main>
      <p>Footer</p>
    </>
  );
};

export default RootLayout;
