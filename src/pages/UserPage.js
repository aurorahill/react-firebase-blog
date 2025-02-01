import React from "react";
import { useUserContext } from "../store/auth-context";
import UserEditForm from "../components/auth/UserEditForm";
import SectionHeader from "../components/UI/SectionHeader";
import classes from "./UserPage.module.scss";
import Button from "../components/UI/Button";
import Blogs from "../components/blog/Blogs";

import Spinner from "../components/UI/Spinner";
import Aside from "../components/Aside";
import { useBlogContext } from "../store/blog-context";

const UserPage = () => {
  const { editMode, user, handleEditClick } = useUserContext();
  const { loading } = useBlogContext();

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
              <p>{user.displayName}</p>
              <p>{user.email}</p>
              <Button
                onClick={handleEditClick}
                className={classes["user-page__button"]}
              >
                Edytuj
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
