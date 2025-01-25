import React from "react";
import SectionHeader from "../UI/SectionHeader";
import MostPopularItem from "./MostPopularItem";

const MostPopular = ({ blogs }) => {
  return (
    <section>
      <SectionHeader>Most Popular</SectionHeader>
      {blogs?.map((item) => (
        <MostPopularItem
          item={item}
          key={item.id}
        />
      ))}
    </section>
  );
};

export default MostPopular;
