import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../store/auth-context";
import classes from "./Header.module.scss";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const { user, logout } = useUserContext();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const navRef = useRef(null);

  const navigate = useNavigate();
  const userId = user?.uid;
  const userName = user?.displayName;

  const handleLogout = () => {
    logout();
    setMenuIsOpen(false);
    navigate("/auth");
  };

  const toggleMenuHandler = () => {
    setMenuIsOpen((prevState) => !prevState);
  };

  const closeMenuHandler = () => {
    setMenuIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuIsOpen &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setMenuIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuIsOpen]);

  return (
    <header className={classes.header}>
      <button
        className={classes.menuToggle}
        onClick={toggleMenuHandler}
        aria-label="Toggle navigation"
      >
        {menuIsOpen ? <FiX /> : <FiMenu />}
      </button>

      <nav
        ref={navRef}
        className={`${classes.mainNav} ${menuIsOpen ? classes.open : ""}`}
      >
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              onClick={closeMenuHandler}
            >
              Strona główna
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              onClick={closeMenuHandler}
            >
              O blogu
            </NavLink>
          </li>
          {userId && (
            <>
              <li>
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  onClick={closeMenuHandler}
                >
                  Nowy wpis
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/${encodeURIComponent(userName)}/${userId}`}
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                  onClick={closeMenuHandler}
                >
                  Mój profil
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <ul className={classes["user-list"]}>
          {userId ? (
            <>
              <div className={classes["user-list__wrapper"]}>
                <div className={classes.user}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="Logo"
                    className={classes.user__logo}
                  />
                </div>
                <p className={classes.user__name}>
                  <NavLink to={`/${encodeURIComponent(userName)}/${userId}`}>
                    {user?.displayName}
                  </NavLink>
                </p>
              </div>
              <li
                onClick={handleLogout}
                className={classes.user__logout}
              >
                Wyloguj
              </li>
            </>
          ) : (
            <li>
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                onClick={closeMenuHandler}
              >
                Zaloguj
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
