import React from "react";
import { Timestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import SectionHeader from "../UI/SectionHeader";
import FeatureBlogsItem from "./FeatureBlogsItem";

const FeatureBlogs = ({ title, blogs }) => {
  return (
    <section>
      <SectionHeader>{title}</SectionHeader>
      {blogs?.map((item) => (
        <FeatureBlogsItem
          item={item}
          key={item.id}
        />
      ))}
    </section>
  );
};

export default FeatureBlogs;

FeatureBlogs.propTypes = {
  title: PropTypes.string,
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      imgURL: PropTypes.string,
      timestamp: PropTypes.instanceOf(Timestamp),
    })
  ).isRequired,
};
