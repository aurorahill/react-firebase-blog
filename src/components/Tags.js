import React from "react";
import classes from "./Tags.module.scss";
import SectionHeader from "./SectionHeader";

const Tags = ({ tags }) => {
  return (
    <section>
      <SectionHeader>Tags</SectionHeader>
      {
        <div className={classes.tags}>
          {tags?.map((tag, index) => (
            <p
              className={classes.tags__tag}
              key={index}
            >
              {tag}
            </p>
          ))}
        </div>
      }
    </section>
  );
};

export default Tags;
