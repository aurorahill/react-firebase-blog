import React from "react";
import BlogItem from "./BlogItem";
import classes from "./BlogSection.module.scss";
import SectionHeader from "../SectionHeader";

const BlogSection = ({ blogs, handleDelete }) => {
  return (
    <div className={classes.blog}>
      <SectionHeader>Daily Blogs</SectionHeader>
      <div className={classes.blog__content}>
        {blogs?.map((item) => (
          <BlogItem
            key={item.id}
            item={item}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
