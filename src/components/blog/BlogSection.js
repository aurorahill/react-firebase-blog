import React from "react";
import BlogItem from "./BlogItem";
import classes from "./BlogSection.module.scss";
import SectionHeader from "../SectionHeader";
import { useDailyBlogContext } from "../../store/daily-blog-context";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";
import Search from "../Search";

const BlogSection = () => {
  const { filteredBlogs, fetchMore, isEmpty, loading, searchTerm } =
    useDailyBlogContext();

  return (
    <>
      <Search className={classes.search} />
      <div className={classes.blog}>
        <SectionHeader>Daily Blogs</SectionHeader>
        <div className={classes.blog__content}>
          {filteredBlogs.length === 0 && (
            <p className={classes.blog__message}>
              No blog found with this keyword.
            </p>
          )}
          {filteredBlogs?.map((item) => (
            <BlogItem
              key={item.id}
              item={item}
            />
          ))}
          {loading && <Spinner />}
        </div>
        {searchTerm === "" && !isEmpty && (
          <div className={classes.blog__btn}>
            <Button onClick={fetchMore}>Load more</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogSection;
