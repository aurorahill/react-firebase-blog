import React from "react";
import { useLocation } from "react-router-dom";
import { useBlogContext } from "../store/blog-context";
import Tags from "./Tags";
import FeatureBlogs from "./feature-blogs/FeatureBlogs";
import classes from "./Aside.module.scss";
import Spinner from "./UI/Spinner";
import Search from "./Search";
import Category from "./Category";

const Aside = () => {
  const { loading, tags, recentBlogs, mostLikedBlogs } = useBlogContext();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={classes.aside}>
      {location.pathname === "/" && (
        <Search className={classes.aside__search} />
      )}
      <Tags
        header="Tagi"
        tags={tags}
      />
      <FeatureBlogs
        blogs={mostLikedBlogs}
        title="Popularne"
      />
      <FeatureBlogs
        blogs={recentBlogs}
        title="Najnowsze"
      />
      <Category />
    </div>
  );
};

export default Aside;
