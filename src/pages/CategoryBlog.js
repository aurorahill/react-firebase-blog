import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import SectionHeader from "../components/UI/SectionHeader";
import BlogItem from "../components/blog/BlogItem";
import Spinner from "../components/UI/Spinner";
import { scrollToSection } from "../utility/scrollToSection";
import classes from "./CategoryBlog.module.scss";
import { useBlogContext } from "../store/blog-context";

const CategoryBlog = () => {
  const { category } = useParams();
  const categoryBlogsRef = useRef(null);
  const {
    categoryPage,
    loadingPage: loading,
    getCategoryPage,
  } = useBlogContext();

  useEffect(() => {
    getCategoryPage(category).then(() => {
      setTimeout(() => scrollToSection(categoryBlogsRef.current), 0);
    });
  }, [category, getCategoryPage]);

  return (
    <section
      className={classes["category-blogs"]}
      ref={categoryBlogsRef}
    >
      <SectionHeader backButton>
        Kategoria: <strong>{category.toUpperCase()}</strong>
      </SectionHeader>
      {loading ? (
        <Spinner />
      ) : (
        <div className={classes["category-blogs__wrapper"]}>
          {categoryPage?.map((item) => (
            <BlogItem
              item={item}
              key={item.id}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryBlog;
