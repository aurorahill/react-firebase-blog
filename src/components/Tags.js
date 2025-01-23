import React from "react";
import classes from "./Tags.module.scss";
import SectionHeader from "./SectionHeader";
import { Link } from "react-router-dom";

const Tags = ({ tags }) => {
  return (
    <section>
      <SectionHeader>Tags</SectionHeader>
      {
        <div className={classes.tags}>
          {tags?.map((tag, index) => (
            <Link
              to={`/tag/${tag}`}
              key={index}
            >
              <div className={classes.tags__tag}>{tag}</div>
            </Link>
          ))}
        </div>
      }
    </section>
  );
};

export default Tags;
