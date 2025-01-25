import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import SectionHeader from "../components/UI/SectionHeader";
import BlogItem from "../components/blog/BlogItem";
import Spinner from "../components/UI/Spinner";
import classes from "./TagBlog.module.scss";

const TagBlog = () => {
  const [tagBlogs, setTagBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tag } = useParams();

  const getTagsBlogs = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const tagBlogQuery = query(blogRef, where("tags", "array-contains", tag));
    const querySnapshot = await getDocs(tagBlogQuery);
    let tagBlogs = [];
    querySnapshot.forEach((doc) => {
      tagBlogs.push({ id: doc.id, ...doc.data([]) });
    });
    setTagBlogs(tagBlogs);
    setLoading(false);
  };

  useEffect(() => {
    getTagsBlogs();
    window.scrollTo(0, 0);
  }, [tag]);

  return (
    <section className={classes["tag-blogs"]}>
      <SectionHeader>
        Tag: <strong>{tag.toUpperCase()}</strong>
      </SectionHeader>
      {loading ? (
        <Spinner />
      ) : (
        <div className={classes["tag-blogs__wrapper"]}>
          {tagBlogs?.map((item) => (
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
