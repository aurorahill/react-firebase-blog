import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classes from "./Tags.module.scss";
import SectionHeader from "./UI/SectionHeader";
import { Link, useLocation } from "react-router-dom";
import ScrollWrapper from "./UI/ScrollWrapper";

const Tags = ({ header, tags }) => {
  const location = useLocation();
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const currentTag = location.pathname.split("/")[2];
    setActiveTag(currentTag); // Ustawiamy stan na tag z URL
  }, [location.pathname]);

  return (
    <section>
      {header && <SectionHeader>{header}</SectionHeader>}
      {
        <div className={classes.tags}>
          <ScrollWrapper className={classes.scroll}>
            {tags?.map((tag, index) => (
              <Link
                to={`/tag/${encodeURIComponent(tag)}`}
                key={index}
              >
                <div
                  className={
                    activeTag === tag
                      ? `${classes.tags__tag} ${classes.active}`
                      : classes.tags__tag
                  }
                >
                  {tag}
                </div>
              </Link>
            ))}
          </ScrollWrapper>
        </div>
      }
    </section>
  );
};

export default Tags;

Tags.propTypes = {
  header: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
};
