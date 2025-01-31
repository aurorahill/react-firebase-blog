import React, { useEffect } from "react";
import BlogItem from "../components/blog/BlogItem";
import classes from "./Home.module.scss";
import SectionHeader from "../components/UI/SectionHeader";
import { useBlogContext } from "../store/blog-context";
import Button from "../components/UI/Button";
import Spinner from "../components/UI/Spinner";
import Search from "../components/Search";
import Modal from "../components/UI/Modal";

const Home = () => {
  const {
    filteredBlogs,
    fetch4More,
    isEmpty,
    loading4More,
    searchTerm,
    get4Blogs,
    error,
    setError,
  } = useBlogContext();

  useEffect(() => {
    get4Blogs();
  }, [get4Blogs]);

  return (
    <section>
      <Search className={classes.search} />
      <div className={classes.blog}>
        <SectionHeader>Blogi</SectionHeader>
        <div className={classes.blog__content}>
          {filteredBlogs.length === 0 && (
            <p className={classes.blog__message}>
              No blog found with this keyword.
            </p>
          )}
          {filteredBlogs?.map((item) => (
            <BlogItem
              key={`home-${item.id}`}
              item={item}
            />
          ))}
          {loading4More && <Spinner />}
        </div>
        {searchTerm === "" && !isEmpty && (
          <div className={classes.blog__btn}>
            <Button onClick={fetch4More}>Load more</Button>
          </div>
        )}
      </div>
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
    </section>
  );
};

export default Home;
