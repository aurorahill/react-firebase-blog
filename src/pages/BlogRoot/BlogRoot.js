import React from "react";
import classes from "./BlogRoot.module.scss";
import Trending from "../../components/Trending/Trending";
import Aside from "../../components/Aside/Aside";
import { Outlet } from "react-router-dom";
import Spinner from "../../components/UI/Spinner/Spinner";
import { useBlogContext } from "../../store/blog-context";

const BlogRoot = () => {
  const { loading } = useBlogContext();

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={classes.root}>
      <Trending />
      <div className={classes.root__wrapper}>
        <main className={classes.root__blog}>
          <Outlet />
        </main>
        <Aside />
      </div>
    </div>
  );
};

export default BlogRoot;
