import React from "react";
import { useLocation } from "react-router-dom";
import { useBlogContext } from "../store/blog-context";
import Tags from "./Tags";
import MostPopular from "./most-popular/MostPopular";
import classes from "./Aside.module.scss";
import Spinner from "./UI/Spinner";
import Search from "./Search";
import Category from "./Category";

const Aside = () => {
  const { tags, blogs, loading } = useBlogContext();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={classes.aside}>
      {location.pathname === "/" && (
        <Search className={classes.aside__search} />
      )}
      <Tags tags={tags} />
      <MostPopular blogs={blogs} />
      <Category />
    </div>
  );
};

export default Aside;
