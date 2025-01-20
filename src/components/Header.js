import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../store/auth-context";
import classes from "./Header.module.scss";

const Header = () => {
  const { user, logout } = useUserContext();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const navigate = useNavigate();
  const userId = user?.uid;

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

  return (
    <header className={classes.header}>
      <button
        className={classes.menuToggle}
        onClick={toggleMenuHandler}
        aria-label="Toggle navigation"
      >
        <span>
          {menuIsOpen ? (
            <i className="fa-solid fa-x"></i>
          ) : (
            <i className="fa-solid fa-bars"></i>
          )}
        </span>
      </button>

      <nav className={`${classes.mainNav} ${menuIsOpen ? classes.open : ""}`}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              onClick={closeMenuHandler}
            >
              Home
            </NavLink>
          </li>
          {userId && (
            <li>
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                onClick={closeMenuHandler}
              >
                Create
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              onClick={closeMenuHandler}
            >
              About
            </NavLink>
          </li>
        </ul>

        <ul className={classes["user-list"]}>
          {userId ? (
            <>
              <div className={classes.user}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Logo"
                  className={classes.user__logo}
                />
              </div>
              <p className={classes.user__name}>{user?.displayName}</p>
              <li
                onClick={handleLogout}
                className={classes.user__logout}
              >
                Logout
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
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
