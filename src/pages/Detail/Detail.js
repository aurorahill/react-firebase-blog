import React, { useEffect } from "react";
import classes from "./Detail.module.scss";
import { useParams } from "react-router-dom";
import { useDetailContext } from "../../store/datail-context";
import Spinner from "../../components/UI/Spinner/Spinner";
import photoImg from "../../assets/photo.jpg";
import Like from "../../components/Like/Like";
import { dataFormatter } from "../../utility/dataFormatter";
import Tags from "../../components/Tags/Tags";
import ActionsIcons from "../../components/UI/ActionIcons/ActionsIcons";
import Comments from "../../components/Comments/Comments";
import CommentBox from "../../components/Comments/CommentBox/CommentBox";
import Aside from "../../components/Aside/Aside";
import RelatedBlog from "../../components/Related-Blog/RelatedBlog";
import Modal from "../../components/UI/Modal/Modal";

const Detail = () => {
  const { getBlogDetail, loading, blog, error, setError } = useDetailContext();

  const { id } = useParams();

  useEffect(() => {
    id && getBlogDetail(id);
    window.scrollTo(0, 0);
  }, [id, getBlogDetail]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className={classes.detail}>
      <section
        className={classes.detail__hero}
        title={blog?.imgURL}
        style={
          blog?.imgURL
            ? { backgroundImage: `url(${blog.imgURL})` }
            : { backgroundImage: `url(${photoImg})` }
        }
      >
        <div className={classes.detail__overlay}></div>
        <div className={classes.detail__title}>
          <p className={classes.detail__category}>{blog?.category}</p>
          <span>{dataFormatter(blog?.timestamp)}</span>

          <h2>{blog?.title}</h2>
        </div>
      </section>
      <div className={classes.detail__wrapper}>
        <main className={classes.detail__content}>
          <section>
            <div className={classes.detail__data}>
              <p>
                By&nbsp;
                <span className={classes.detail__author}>{blog?.author}</span>
                &nbsp;|&nbsp;
                <span>{dataFormatter(blog?.timestamp)}</span>
              </p>
              <Like id={id} />
            </div>
            <p className={classes.detail__description}>{blog?.description}</p>

            <Tags tags={blog?.tags} />
            <ActionsIcons
              item={blog}
              id={id}
            />
          </section>
          <Comments id={id} />
          <CommentBox id={id} />
        </main>
        <Aside />
      </div>
      <RelatedBlog id={id} />
      {error && (
          <Modal
          open={!!error}
          onClose={() => {
            setError(null);
          }}
          error="Błąd podczas pobierania danych"
          message={error}
        />
      )}
    </div>
  );
};

export default Detail;
