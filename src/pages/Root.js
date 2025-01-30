import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import classes from "./Root.module.scss";
import Footer from "../components/Footer";
import PullToRefresh from "react-simple-pull-to-refresh";

const RootLayout = () => {
  const handleRefresh = async () => {
    console.log("Refreshing content...");
    window.location.reload();
  };
  return (
    <>
      <PullToRefresh
        onRefresh={handleRefresh}
        pullDownThreshold={70}
      >
        <div className={classes.layout}>
          <Header />
          <main className={classes.main}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </PullToRefresh>
    </>
  );
};

export default RootLayout;
