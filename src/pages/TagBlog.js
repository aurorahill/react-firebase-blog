import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import SectionHeader from "../components/UI/SectionHeader";
import BlogItem from "../components/blog/BlogItem";
import Spinner from "../components/UI/Spinner";
import { scrollToSection } from "../utility/scrollToSection";

import classes from "./TagBlog.module.scss";
import { useBlogContext } from "../store/blog-context";

const TagBlog = () => {
  const { getTagPage, tagPage, loadingPage: loading } = useBlogContext();
  const { tag } = useParams();
  const tagBlogsRef = useRef(null);

  useEffect(() => {
    getTagPage(tag);
    scrollToSection(tagBlogsRef.current);
  }, [tag, getTagPage]);

  return (
    <section
      className={classes["tag-blogs"]}
      ref={tagBlogsRef}
    >
      <SectionHeader backButton>
        Tag: <strong>{tag.toUpperCase()}</strong>
      </SectionHeader>
      {loading ? (
        <Spinner />
      ) : (
        <div className={classes["tag-blogs__wrapper"]}>
          {tagPage?.map((item) => (
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

export default TagBlog;
