import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import photoImg from "../assets/photo.png";
import classes from "./Detail.module.scss";
import Spinner from "../components/UI/Spinner";
import Aside from "../components/Aside";

const Detail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(docRef);
    setBlog(blogDetail.data());
    setLoading(false);
  };

  useEffect(() => {
    id && getBlogDetail();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={classes.detail}>
      <div
        className={classes.detail__hero}
        // style={{ backgroundImage: `url('${blog?.imgUrl})` }}
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
