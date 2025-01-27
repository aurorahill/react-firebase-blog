import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import photoImg from "../assets/photo.jpg";
import classes from "./Detail.module.scss";
import Spinner from "../components/UI/Spinner";
import Aside from "../components/Aside";
import RelatedBlog from "../components/related-blog/RelatedBlog";
import Tags from "../components/Tags";
import Comments from "../components/comments/Comments";
import CommentBox from "../components/comments/CommentBox";
import { useDetailContext } from "../store/datail-context";
import Like from "../components/like/Like";

const Detail = () => {
  const { getBlogDetail, loading, blog } = useDetailContext();
  const { id } = useParams();

  useEffect(() => {
    id && getBlogDetail(id);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={classes.detail}>
      <section
        className={classes.detail__hero}
        style={
          blog?.imgURL
            ? { backgroundImage: `url(${blog.imgURL})` }
            : { backgroundImage: `url(${photoImg})` }
        }
      >
        <div className={classes.detail__overlay}></div>
        <div className={classes.detail__title}>
          <span>{blog?.timestamp.toDate().toDateString()}</span>
          <h2>{blog?.title}</h2>
        </div>
      </section>
      <div className={classes.detail__wrapper}>
        <div className={classes.detail__content}>
          <section>
            <div className={classes.detail__data}>
              <p>
                By&nbsp;
                <span className={classes.detail__author}>{blog?.author}</span>
                &nbsp;|&nbsp;
                <span>{blog?.timestamp.toDate().toDateString()}</span>
              </p>
              <Like id={id} />
            </div>

            <p className={classes.detail__description}>{blog?.description}</p>

            <Tags tags={blog?.tags} />

            <CommentBox id={id} />
          </section>
          <Comments id={id} />
        </div>
        <Aside />
      </div>
      <RelatedBlog id={id} />
    </div>
  );
};

export default Detail;
