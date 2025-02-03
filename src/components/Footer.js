import React from "react";
import classes from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div></div>
      <div className={classes.footer__rights}>
        <p>
          <strong>Błażowski Blog Rodzinny</strong>&nbsp;&copy;&nbsp;2025
        </p>
        <p>
          Made with&nbsp;&hearts;&nbsp;by&nbsp;
          <strong>
            <a
              href="https://lubeckawebsites.pl/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Kasia Lubecka
            </a>
          </strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
