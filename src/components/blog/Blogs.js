import React, { useEffect } from "react";
import { useUserBlogsContext } from "../../store/user-blogs-context";
import classes from "./Blogs.module.scss";
import SectionHeader from "../UI/SectionHeader";
import Spinner from "../UI/Spinner";
import BlogItem from "./BlogItem";
import Pagination from "../Pagination";

const Blogs = () => {
  const {
    paginationBlogs: blogs,
    loading,
    currentPage,
    handlePageChange,
    numOfPages,
  } = useUserBlogsContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        numOfPages={numOfPages}
      />
    </section>
  );
};

export default Blogs;
