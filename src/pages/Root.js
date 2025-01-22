import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import classes from "./Root.module.scss";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <>
      <Header />
      <main className={classes.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
