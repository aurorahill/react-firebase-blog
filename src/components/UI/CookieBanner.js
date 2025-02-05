import React, { useState, useEffect } from "react";
import classes from "./CookieBanner.module.scss";
import Button from "./Button";

const CookieBanner = () => {
  const [cookieEaten, setCookieEaten] = useState(false);

  useEffect(() => {
    const storedCookie = localStorage.getItem("cookie");
    if (storedCookie) {
      setCookieEaten(true);
    }
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem("cookie", "true");
    setCookieEaten(true);
  };

  if (cookieEaten) {
    return null;
  }
  return (
    <div className={classes["cookie-box"]}>
      <p>Strona korzysta tylko z niezbędnych ciasteczek!</p>
      <Button
        className={classes["cookie-box__btn"]}
        onClick={handleCookieAccept}
      >
        Akceptuj 🍪
      </Button>
    </div>
  );
};

export default CookieBanner;
