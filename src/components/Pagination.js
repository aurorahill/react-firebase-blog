import React from "react";
import PropTypes from "prop-types";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import classes from "./Pagination.module.scss";

const Pagination = ({ currentPage, handlePageChange, numOfPages }) => {
  return (
    <div className={classes.pagination}>
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange("prev")}
        className={classes.pagination__btn}
      >
        <FaAngleLeft />
      </button>

      <p className={classes.pagination__page}>{currentPage}</p>

      <button
        disabled={currentPage === numOfPages}
        onClick={() => handlePageChange("next")}
        className={classes.pagination__btn}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default Pagination;

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  numOfPages: PropTypes.number.isRequired,
};
