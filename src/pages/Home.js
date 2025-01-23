// import BlogSection from "../components/blog/BlogSection";

// const Home = () => {
//   return <BlogSection />;
// };

// export default Home;

import React from "react";
import BlogItem from "../components/blog/BlogItem";
import classes from "./Home.module.scss";
import SectionHeader from "../components/SectionHeader";
import { useDailyBlogContext } from "../store/daily-blog-context";
import Button from "../components/UI/Button";
import Spinner from "../components/UI/Spinner";
import Search from "../components/Search";

const Home = () => {
  const { filteredBlogs, fetchMore, isEmpty, loading, searchTerm } =
    useDailyBlogContext();

  return (
    <section>
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
    </section>
  );
};

export default Home;
