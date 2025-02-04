import classes from "./Footer.module.scss";
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useUserContext } from "../store/auth-context";
import logoImage from "../assets/bbr2.jpg";
import contactImage from "../assets/contact.jpg";
import { FaGithub } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

const ScrollToTopFooter = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const Footer = () => {
  const { user } = useUserContext();
  const userId = user?.uid;
  const userName = user?.displayName;

  return (
    <>
      <ScrollToTopFooter />
      <footer className={classes.footer}>
        <div className={classes.footer__wrapper}>
          <div className={classes.footer__logo}>
            <img
              src={logoImage}
              alt="Logo"
            />
          </div>
          <div className={classes["footer__nav-wrapper"]}>
            <div className={classes["footer__contact-link"]}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/katarzyna-lubecka-b4736a182"
              >
                <FaLinkedinIn />
              </a>

              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/aurorahill"
              >
                <FaGithub />
              </a>

              <a href="tel:+48792829594">
                <FaPhoneAlt />
              </a>
            </div>
            <nav className={classes.footer__nav}>
              <ul>
                <li>
                  <NavLink to="/">Strona główna</NavLink>
                </li>
                <li>
                  <NavLink to="/about">O blogu</NavLink>
                </li>
                {userId && (
                  <>
                    <li>
                      <NavLink to="/create">Nowy wpis</NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/${encodeURIComponent(userName)}/${userId}`}
                      >
                        Moje konto
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
          <div className={classes["footer__contact-img"]}>
            <img
              src={contactImage}
              alt="Kontakt"
            />
          </div>
        </div>

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
    </>
  );
};

export default Footer;
