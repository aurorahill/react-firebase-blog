import React, { useState, useEffect } from "react";
import classes from "./ScrollToTop.module.scss";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className={classes["scroll-to-top"]}>
      {isVisible && (
        <span onClick={scrollToTop}>
          <FaArrowUp />
        </span>
      )}
    </div>
  );
};

export default ScrollToTop;
