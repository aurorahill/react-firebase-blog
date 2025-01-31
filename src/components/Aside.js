import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useBlogContext } from "../store/blog-context";
import Tags from "./Tags";
import FeatureBlogs from "./feature-blogs/FeatureBlogs";
import classes from "./Aside.module.scss";
import Spinner from "./UI/Spinner";
import Search from "./Search";
import Category from "./Category";
import Modal from "./UI/Modal";

const Aside = () => {
  const {
    tags,
    recentBlogs,
    mostLikedBlogs,
    getRecentBlogs,
    getMostLikedBlogs,
    error,
    setError,
  } = useBlogContext();
  const location = useLocation();
  const [loading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);
    getRecentBlogs();
    getMostLikedBlogs();
    setLoading(false);
  }, [getRecentBlogs, getMostLikedBlogs]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <aside className={classes.aside}>
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
      </aside>
      {error && (
        <Modal
          open={!!error}
          onClose={() => {
            setError(null);
          }}
          error="Błąd podczas pobierania danych"
          message={error}
        />
      )}
    </>
  );
};

export default Aside;
