import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import SectionHeader from "../components/UI/SectionHeader";
import BlogItem from "../components/blog/BlogItem";
import Spinner from "../components/UI/Spinner";
import { scrollToSection } from "../utility/scrollToSection";
import classes from "./CategoryBlog.module.scss";

const CategoryBlog = () => {
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category } = useParams();
  const categoryBlogsRef = useRef(null);

  const getCategoryBlogs = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const categoryBlogQuery = query(blogRef, where("category", "==", category));
    const querySnapshot = await getDocs(categoryBlogQuery);
    let categoryBlogs = [];
    querySnapshot.forEach((doc) => {
      categoryBlogs.push({ id: doc.id, ...doc.data([]) });
    });
    setCategoryBlogs(categoryBlogs);
    setLoading(false);
  };

  useEffect(() => {
    getCategoryBlogs();
    scrollToSection(categoryBlogsRef.current);
  }, [category]);

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
          {categoryBlogs?.map((item) => (
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
