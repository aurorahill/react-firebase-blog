import React from "react";
import PropTypes from "prop-types";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";

const LikeStatus = ({ userId, likes }) => {
  if (likes?.length > 0) {
    return likes.find((id) => id === userId) ? (
      <>
        <FaThumbsUp />
        &nbsp;{likes.length}
      </>
    ) : (
      <>
        <FaRegThumbsUp />
        &nbsp;{likes.length}
      </>
    );
  }
  return (
    <>
      <FaRegThumbsUp />
      &nbsp;<span>Lubię to!</span>
    </>
  );
};

export default LikeStatus;

LikeStatus.propTypes = {
  userId: PropTypes.string,
  likes: PropTypes.arrayOf(PropTypes.string).isRequired,
};
