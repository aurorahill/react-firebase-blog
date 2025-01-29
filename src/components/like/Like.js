import React, { useState, useEffect } from "react";
import { useUserContext } from "../../store/auth-context";
import { useDetailContext } from "../../store/datail-context";
import LikeStatus from "./LikeStatus";
import classes from "./Like.module.scss";
import Button from "../UI/Button";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Like = ({ id }) => {
  const { blog, likes, setLikes, setLikeCount } = useDetailContext();
  const { user } = useUserContext();
  const userId = user?.uid;

  const [showTooltip, setShowTooltip] = useState(false);

  const handleLike = async () => {
    let newLikes = [...likes];
    if (userId) {
      if (blog?.likes) {
        const index = likes.findIndex((id) => id === userId);
        if (index === -1) {
          newLikes.push(userId);
          setLikes([...new Set(likes)]);
        } else {
          newLikes = newLikes.filter((id) => id !== userId);
        }
        setLikes(newLikes);
        setLikeCount(newLikes.length);
      }
      await updateDoc(doc(db, "blogs", id), {
        ...blog,
        likes: newLikes,
        countLikes: newLikes.length,
        timestamp: serverTimestamp(),
      });
    } else {
      setShowTooltip(true);
    }
  };

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  return (
    <div className={classes.like}>
      <span onClick={handleLike}>
        <Button
          className={classes.like__button}
          type="button"
          title={!userId ? "Zaloguj się by polubić" : "Like"}
        >
          <LikeStatus userId />
        </Button>
      </span>
      {showTooltip && (
        <div className={classes.tooltip}>Zaloguj się by polubić</div>
      )}
    </div>
  );
};

export default Like;
