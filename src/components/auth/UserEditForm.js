import React from "react";
import { useUserContext } from "../../store/auth-context";
import Input from "../UI/Input";
import Button from "../UI/Button";
import classes from "./UserEditForm.module.scss";

const UserEditForm = () => {
  const {
    handleSaveClick,
    handleCancelClick,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    newEmail,
    setNewEmail,
    loading,
  } = useUserContext();

  return (
    <form className={classes["user-edit-form"]}>
      <div className={classes["user-edit-form__box"]}>
        <label htmlFor="firstName">Imię</label>
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          classNameDiv={classes["user-edit-form__input"]}
          required
        />
      </div>
      <div className={classes["user-edit-form__box"]}>
        <label htmlFor="lastName">Nazwisko</label>
        <Input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          classNameDiv={classes["user-edit-form__input"]}
          required
        />
      </div>
      <div className={classes["user-edit-form__box"]}>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          classNameDiv={classes["user-edit-form__input"]}
          required
        />
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
          onClick={handleSaveClick}
          className={classes["user-edit-form__btn"]}
          disabled={loading}
        >
          {loading ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </div>
    </form>
  );
};

export default UserEditForm;
