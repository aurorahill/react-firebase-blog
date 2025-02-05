import React from "react";
import PropTypes from "prop-types";
import SectionHeader from "../UI/SectionHeader";
import Card from "./Card";
import classes from "./RelatedBlog.module.scss";
import { useDetailContext } from "../../store/datail-context";

const RelatedBlog = ({ id }) => {
  const { relatedBlogs: blogs } = useDetailContext();
  return (
    <section className={classes.related}>
      <SectionHeader>Powiązane blogi</SectionHeader>
      <div className={classes.related__wrapper}>
        {blogs?.length === 1 && <p>Ten blog nie ma powiązanych blogów</p>}
        {blogs
          ?.filter((blogs) => blogs.id !== id)
          .map((item) => (
            <Card
              {...item}
              key={item.id}
            />
          ))}
      </div>
    </section>
  );
};

export default RelatedBlog;

RelatedBlog.propTypes = {
  id: PropTypes.string.isRequired,
};
