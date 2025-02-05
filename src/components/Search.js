import React from "react";
import PropTypes from "prop-types";
import classes from "./Search.module.scss";
import SectionHeader from "./UI/SectionHeader";
import { useBlogContext } from "../store/blog-context";
import Input from "./UI/Input";

const Search = ({ className }) => {
  const { searchTerm, setSearchTerm } = useBlogContext();

  const handleChange = (e) => {
    setSearchTerm(e.target.value); // Aktualizujemy tekst wyszukiwania
  };

  return (
    <section
      className={className ? `${className} ${classes.search}` : classes.search}
    >
      <div className={classes.search__header}>
        <SectionHeader>Szukaj</SectionHeader>
      </div>
      <Input
        type="text"
        value={searchTerm}
        placeholder="Szukaj"
        onChange={handleChange}
      />
    </section>
  );
};

export default Search;

Search.propTypes = {
  className: PropTypes.string,
};
