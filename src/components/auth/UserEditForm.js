import React from "react";
import { useUserContext } from "../../store/auth-context";
import { useDetailContext } from "../../store/datail-context";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { toast } from "react-toastify";
import classes from "./UserEditForm.module.scss";

const UserEditForm = () => {
  const {
    handleSaveClick,
    handleCancelClick,
    firstName,
    lastName,
    handleChange,
    handleBlur,
    email,
    errors,
    isLoading,
    user,
    setEditMode,
  } = useUserContext();
  const { updateCommentsUserName, sendingComment, updateBlogAuthor } =
    useDetailContext();

  const handleSave = async () => {
    try {
      await handleSaveClick();
      await updateCommentsUserName(user.uid, firstName, lastName);
      await updateBlogAuthor(user, firstName, lastName);
      setEditMode(false);
    } catch (err) {
      console.log(err);
      toast.error("Coś poszło nie tak. Spróbuj ponownie później");
    }
  };

  return (
    <form className={classes["user-edit-form"]}>
      <div className={classes["user-edit-form__box"]}>
        <label htmlFor="firstName">Imię</label>
        <Input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          classNameDiv={classes["user-edit-form__input"]}
          required
        />
        {errors.firstName && (
          <p className={classes.error}>{errors.firstName}</p>
        )}
      </div>
      <div className={classes["user-edit-form__box"]}>
        <label htmlFor="lastName">Nazwisko</label>
        <Input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          classNameDiv={classes["user-edit-form__input"]}
          required
        />
        {errors.lastName && <p className={classes.error}>{errors.lastName}</p>}
      </div>
      <div className={classes["user-edit-form__box"]}>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          classNameDiv={classes["user-edit-form__input"]}
          required
        />
        {errors.email && <p className={classes.error}>{errors.email}</p>}
      </div>
      <div className={classes["user-edit-form__box"]}>
        <Button
          textOnly
          type="button"
          onClick={handleCancelClick}
          className={classes["user-edit-form__btn"]}
        >
          Zamknij
        </Button>
        <Button
          onClick={handleSave}
          className={classes["user-edit-form__btn"]}
          disabled={isLoading || sendingComment}
        >
          {isLoading || sendingComment ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </div>
    </form>
  );
};

export default UserEditForm;
