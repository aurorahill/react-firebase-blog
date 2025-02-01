import React, { useEffect } from "react";
import { useUserContext } from "../../store/auth-context";
import { useDetailContext } from "../../store/datail-context";
import LikeStatus from "./LikeStatus";
import classes from "./Like.module.scss";
import Button from "../UI/Button";
import Modal from "../UI/Modal";

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
