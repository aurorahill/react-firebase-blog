import React, { useContext } from "react";
import { shortText } from "../../utility/shortText";
import Button from "../UI/Button";
import FontAwesome from "react-fontawesome";
import photoImg from "../../assets/photo.jpg";
import classes from "./BlogItem.module.scss";
import { Link } from "react-router-dom";
import { UserContext } from "../../store/auth-context";
import { useBlogContext } from "../../store/blog-context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

const BlogItem = ({ item }) => {
  const { user } = useContext(UserContext);
  const { setLoading, setTrendBlogs } = useBlogContext();

  const userId = user?.uid;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully!");
        //sprawdz czy dziala!!!!!
        setTrendBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== id)
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!item || !item.timestamp) {
    return <p>Loading...</p>;
  }
  return (
    <div className={classes.item}>
      <div className={classes.item__image}>
        <img
          src={item.imgURL || photoImg}
          alt={item.title}
        />
      </div>
      <div className={classes.item__wrapper}>
        <h6 className={classes.item__category}>{item.category}</h6>
        <h3 className={classes.item__title}>{item.title}</h3>
        <div className={classes.item__content}>
          <p className={classes.item__author}>{item.author}</p>
          <p className={classes.item__date}>
            {item.timestamp.toDate().toDateString()}
          </p>
        </div>

        <div className={classes.item__description}>
          {shortText(item.description, 80)}
        </div>
        <div className={classes.item__actions}>
          <Link to={`/detail/${item.id}`}>
            <Button className={classes.item__btn}>Read more</Button>
          </Link>
          {userId && item.userId === userId && (
            <div className={classes.item_items}>
              <FontAwesome
                name="trash"
                size="2x"
                style={{ cursor: "pointer" }}
                onClick={() => handleDelete(item.id)}
              />
              <Link to={`/update/${item.id}`}>
                <FontAwesome
                  name="edit"
                  size="2x"
                  style={{ cursor: "pointer", marginLeft: "1.5rem" }}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
