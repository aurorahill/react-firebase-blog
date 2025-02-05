import React, { useEffect } from "react";
import { useUserBlogsContext } from "../../store/user-blogs-context";
import classes from "./Blogs.module.scss";
import SectionHeader from "../UI/SectionHeader";
import Spinner from "../UI/Spinner";
import BlogItem from "./BlogItem";
import Pagination from "../Pagination";
import Modal from "../UI/Modal";
import { Link } from "react-router-dom";

const Blogs = () => {
  const {
    paginationBlogs: blogs,
    loading,
    currentPage,
    handlePageChange,
    numOfPages,
    error,
    setError,
    getBlogs,
    getAllUserBlogs,
  } = useUserBlogsContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (blogs.length === 0) {
      getBlogs();
      getAllUserBlogs();
    }
  }, [getBlogs, getAllUserBlogs, blogs]);

  return (
    <section>
      <div className={classes.blog}>
        <SectionHeader>Twoje blogi</SectionHeader>
        <div className={classes.blog__content}>
          {loading && <Spinner />}
          {blogs?.map((item) => (
            <BlogItem
              key={`pagination-${item.id}`}
              item={item}
            />
          ))}
        </div>
      </div>
      {numOfPages > 0 ? (
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          numOfPages={numOfPages}
        />
      ) : (
        <p className={classes.blog__pagination}>
          Nie masz jeszcze blogów do wyświetlenia. Napisz swojego pierwszego{" "}
          <Link to="/create">bloga</Link>!
        </p>
      )}
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

export default Blogs;
