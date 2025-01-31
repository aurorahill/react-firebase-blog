import React, { useContext } from "react";
import { shortText } from "../../utility/shortText";
import Button from "../UI/Button";
import photoImg from "../../assets/photo.jpg";
import classes from "./BlogItem.module.scss";
import { Link } from "react-router-dom";
import { UserContext } from "../../store/auth-context";
import { useBlogContext } from "../../store/blog-context";
import { FaTrash } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { dataFormatter } from "../../utility/dataFormatter";

const BlogItem = ({ item }) => {
  const { user } = useContext(UserContext);
  const { handleDelete } = useBlogContext();

  const userId = user?.uid;

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
          <p className={classes.item__date}>{dataFormatter(item?.timestamp)}</p>
        </div>

        <div className={classes.item__description}>
          {shortText(item.description, 80)}
        </div>
        <div className={classes.item__actions}>
          <Link to={`/detail/${item.id}`}>
            <Button className={classes.item__btn}>Czytaj więcej</Button>
          </Link>
          {userId && item.userId === userId && (
            <div className={classes.item__icons}>
              <FaTrash
                title="Usuń"
                onClick={() => handleDelete(item.id)}
                className={classes.item__icon}
              />
              <Link to={`/update/${item.id}`}>
                <FaPen
                  title="Edytuj"
                  className={`${classes.item__icon} ${classes.item__edit}`}
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
