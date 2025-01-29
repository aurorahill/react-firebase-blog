import React from "react";
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
