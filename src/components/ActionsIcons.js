import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../store/auth-context";
import { Link } from "react-router-dom";
import classes from "./ActionsIcons.module.scss";
import { useBlogContext } from "../store/blog-context";
import { useUserBlogsContext } from "../store/user-blogs-context";
import Button from "./UI/Button";

const ActionsIcons = ({ item, id }) => {
  const { user } = useUserContext();
  const userId = user?.uid;
  const { updateBlogFromGlobalState } = useBlogContext();
  const { deleteUserBlog, loading } = useUserBlogsContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = (id) => {
    deleteUserBlog(id, updateBlogFromGlobalState);
    if (location.pathname.startsWith("/detail")) {
      navigate("/");
    }
  };

  if (!item) {
    return null;
  }
  return (
    <>
      {userId && item.userId === userId && (
        <div className={classes.items}>
          <Button
            textOnly
            className={classes.items__icon}
            onClick={() => handleDelete(id)}
            disabled={loading}
          >
            <span>{loading ? "Usuwanie" : "Usuń"}</span>
          </Button>
          <Link
            to={`/update/${id}`}
            className={`${classes.items__icon} ${classes.items__edit}`}
          >
            <span>Edytuj</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default ActionsIcons;
