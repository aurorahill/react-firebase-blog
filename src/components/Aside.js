import React from "react";
import { useBlogContext } from "../store/blog-context";
import Tags from "./Tags";
import MostPopular from "./most-popular/MostPopular";
import classes from "./Aside.module.scss";
import Spinner from "./UI/Spinner";

const Aside = () => {
  const { tags, blogs, loading } = useBlogContext();
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={classes.aside}>
      <Tags tags={tags} />
      <MostPopular blogs={blogs} />
    </div>
  );
};

export default Aside;
