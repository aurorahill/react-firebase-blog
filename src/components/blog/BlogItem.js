import React from "react";
import { shortText } from "../../utility/shortText";
import Button from "../UI/Button";
import photoImg from "../../assets/photo.jpg";
import classes from "./BlogItem.module.scss";
import { Link } from "react-router-dom";
import { dataFormatter } from "../../utility/dataFormatter";
import ActionsIcons from "../ActionsIcons";

const BlogItem = ({ item }) => {
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
          <Link to={`/detail/${item?.id}`}>
            <Button className={classes.item__btn}>Czytaj więcej</Button>
          </Link>
          <ActionsIcons
            item={item}
            id={item.id}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
