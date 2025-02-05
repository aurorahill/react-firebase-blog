import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./TagsInput.module.scss";

const TagsInput = ({ values = [], onChange }) => {
  const [tag, setTag] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    // Sprawdzanie ostatniego znaku
    if (value.endsWith(",") || value.endsWith(" ")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag.length && !values.includes(newTag)) {
        onChange([...values, newTag]);
      }
      setTag("");
    } else {
      setTag(value);
    }
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    const newTag = tag.trim();

    if (
      (key === "Enter" || key === "Tab") &&
      newTag.length &&
      !values.includes(newTag)
    ) {
      e.preventDefault();
      onChange([...values, newTag]);
      setTag("");
    } else if (key === "Backspace" && !newTag.length && values.length) {
      e.preventDefault();
      const updatedTags = values.slice(0, -1);
      onChange(updatedTags);
    }
  };

  const removeTag = (index) => {
    const updatedTags = values.filter((_, i) => i !== index);
    onChange(updatedTags);
  };

  return (
    <div className={classes["tags-input"]}>
      {values.map((tag, index) => (
        <div
          key={index}
          className={classes["tags-input__tag"]}
        >
          <span className={classes["tags-input__title"]}>{tag}</span>
          <button
            onClick={() => removeTag(index)}
            className={classes["tags-input__remove-btn"]}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        value={tag}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={classes["tags-input__tag-input"]}
        placeholder="tag1, tag2"
      />
    </div>
  );
};

export default TagsInput;

TagsInput.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};
