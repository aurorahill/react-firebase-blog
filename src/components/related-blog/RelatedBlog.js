import React from "react";
import SectionHeader from "../UI/SectionHeader";
import Card from "./Card";
import classes from "./RelatedBlog.module.scss";
import { useDetailContext } from "../../store/datail-context";

const RelatedBlog = ({ id }) => {
  const { relatedBlogs: blogs } = useDetailContext();
  return (
    <section className={classes.related}>
      <SectionHeader>Related Blogs</SectionHeader>
      <div className={classes.related__wrapper}>
        {blogs?.length === 1 && <p>No blogs related with current blog</p>}
        {blogs
          ?.filter((blogs) => blogs.id !== id)
          .map((item) => (
            <Card
              {...item}
              key={item.id}
            />
          ))}
      </div>
    </section>
  );
};

export default RelatedBlog;
