import React from "react";
import { Link } from "react-router-dom";
import SectionHeader from "./UI/SectionHeader";
import classes from "./Category.module.scss";
import { useBlogContext } from "../store/blog-context";

const Category = () => {
  const { categoryCount: catgBlogCount } = useBlogContext();
  return (
    <section className={classes.category}>
      <SectionHeader>Kategorie</SectionHeader>
      <div className={classes.category__wrapper}>
        <ul>
          {catgBlogCount?.map((item, index) => (
            <li
              key={index}
              className={classes.category__item}
            >
              <Link to={`/category/${item.category}`}>
                {item.category}
                <span>{item.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Category;
