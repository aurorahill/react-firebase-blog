import React, { useEffect } from "react";
import PropTypes from "prop-types";

import LikeStatus from "./LikeStatus";
import classes from "./Like.module.scss";
import Button from "../UI/Button/Button";
import Modal from "../UI/Modal/Modal";
import { useDetailContext } from "../../store/datail-context";
import { useUserContext } from "../../store/auth-context";

const Like = ({ id: blogId }) => {
  const { likes, showTooltip, setShowTooltip, handleLike, error, setError } =
    useDetailContext();
  const { user } = useUserContext();
  const userId = user?.uid;

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip, setShowTooltip]);

  return (
    <>
      <div className={classes.like}>
        <span onClick={() => handleLike(userId, blogId)}>
          <Button
            className={classes.like__button}
            type="button"
            title={!userId ? "Zaloguj się by polubić" : "Like"}
          >
            <LikeStatus
              userId={userId}
              likes={likes}
            />
          </Button>
        </span>
        {showTooltip && (
          <div className={classes.tooltip}>Zaloguj się by polubić</div>
        )}
      </div>
      {error && (
        <Modal
          open={!!error}
          onClose={() => {
            setError(null);
          }}
          error="Błąd podczas wysyłania danych"
          message={error}
        />
      )}
    </>
  );
};

export default Like;

Like.propTypes = {
  id: PropTypes.string.isRequired,
};
