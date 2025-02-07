import React, { useState, useEffect } from "react";
import { useUserContext } from "../store/auth-context";
import { useNavigate } from "react-router-dom";
import UserEditForm from "../components/auth/UserEditForm";
import SectionHeader from "../components/UI/SectionHeader";
import classes from "./UserPage.module.scss";
import Button from "../components/UI/Button";
import Blogs from "../components/blog/Blogs";

import Spinner from "../components/UI/Spinner";
import Aside from "../components/Aside";
import { useBlogContext } from "../store/blog-context";
import { useDetailContext } from "../store/datail-context";
import { toast } from "react-toastify";

const UserPage = () => {
  const { editMode, user, handleEditClick, deleteUserAndBlogs } =
    useUserContext();
  const { deleteCommentsByUser, deleteLikesByUser } = useDetailContext();
  const { loading } = useBlogContext();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        "Czy na pewno chcesz usunąć swoje konto i wszystkie swoje blogi, komentarze oraz polubienia?"
      )
    ) {
      setIsDeleting(true);
      try {
        const isCommentDeleted = await deleteCommentsByUser(user.uid);
        const isLikesDeleted = await deleteLikesByUser(user.uid);
        const isDeleted = await deleteUserAndBlogs(user.uid);
        if (isDeleted && isCommentDeleted && isLikesDeleted) {
          navigate("/auth");
        }
      } catch (err) {
        console.log(err);
        toast.error("Nie udało się usunąć konta użytkownika.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <section className={classes["user-page"]}>
        <SectionHeader>Twoje konto</SectionHeader>
        <div className={classes["user-page__wrapper"]}>
          <div className={classes["user-page__image"]}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Logo"
            />
          </div>
          {editMode ? (
            <UserEditForm />
          ) : (
            <div className={classes["user-page__info"]}>
              <p>{user?.displayName}</p>
              <p>{user?.email}</p>
              <Button
                onClick={handleEditClick}
                className={classes["user-page__button"]}
              >
                Edytuj
              </Button>
              <Button
                onClick={handleDeleteUser}
                className={`${classes["user-page__button"]} ${classes["user-page__delete-btn"]}`}
                textOnly
                disabled={isDeleting}
              >
                {isDeleting ? "Usuwanie..." : "Usuń konto"}
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className={classes["user-blog"]}>
        <main className={classes["user-blog__outlet"]}>
          <Blogs />
        </main>
        <Aside />
      </div>
    </>
  );
};

export default UserPage;
