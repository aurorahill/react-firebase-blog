import classes from "./Button.module.scss";

const Button = ({ children, textOnly, className = "", ...props }) => {
  return (
    <button
      className={
        textOnly
          ? `${classes["btn-text"]} ${className}`
          : `${classes.btn} ${className}`
      }
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
