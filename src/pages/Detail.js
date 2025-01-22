import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import photoImg from "../assets/photo.jpg";
import classes from "./Detail.module.scss";
import Spinner from "../components/UI/Spinner";
import Aside from "../components/Aside";

const Detail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  // const [blogs, setBlogs] = useState([]);
  // const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(docRef);
    setBlog(blogDetail.data());
    setLoading(false);
    // const blogRef = collection(db, "blogs");
    // const blogs = await getDocs(blogRef);
    // setBlogs(blogs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    // let tags = [];
    // blogs.docs.map((doc) => tags.push(...doc.get("tags")));
    // let uniqueTags = [...new Set(tags)];
    // setTags(uniqueTags);
  };

  useEffect(() => {
    id && getBlogDetail();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={classes.detail}>
      <div
        className={classes.detail__hero}
        style={
          blog.imgURL
            ? { backgroundImage: `url(${blog.imgURL})` }
            : { backgroundImage: `url(${photoImg})` }
        }
      >
        <div className={classes.detail__overlay}></div>
        <div className={classes.detail__title}>
          <span>{blog?.timestamp.toDate().toDateString()}</span>
          <h2>{blog?.title}</h2>
        </div>
      </div>
      <div className={classes.detail__wrapper}>
        <div className={classes.detail__content}>
          <p className={classes.detail__data}>
            By <span className={classes.detail__author}>{blog?.author}</span>
            &nbsp;|&nbsp;
            <span>{blog?.timestamp.toDate().toDateString()}</span>
          </p>

          <p className={classes.detail__description}>{blog?.description}</p>
        </div>
        <Aside />
      </div>
    </div>
  );
};

export default Detail;
