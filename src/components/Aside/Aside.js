import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBlogContext } from "../../store/blog-context";
import Tags from "../Tags/Tags";
import FeatureBlogs from "../Feature-Blogs/FeatureBlogs";
import classes from "./Aside.module.scss";
import Spinner from "../UI/Spinner/Spinner";
import Search from "../Search/Search";
import Category from "../Category/Category";
import Modal from "../UI/Modal/Modal";

const Aside = () => {
  const {
    loading,
    tags,
    recentBlogs,
    mostLikedBlogs,
    getRecentBlogs,
    getMostLikedBlogs,
    error,
    setError,
  } = useBlogContext();
  const location = useLocation();

  useEffect(() => {
    getRecentBlogs();
    getMostLikedBlogs();
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
        <Tags header="Tagi" tags={tags} />
        <FeatureBlogs blogs={mostLikedBlogs} title="Popularne" />
        <FeatureBlogs blogs={recentBlogs} title="Najnowsze" />
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
