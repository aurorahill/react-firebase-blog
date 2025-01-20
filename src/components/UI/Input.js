import classes from "./Input.module.scss";

const Input = ({ classNameInput, classNameDiv, ...props }) => {
  let cssInput = classes.input__box;
  let cssDiv = classes.input;
  return (
    <div className={classNameDiv ? `${classNameDiv} ${cssDiv}` : cssDiv}>
      <input
        className={classNameInput ? `${classNameInput} ${cssInput}` : cssInput}
        required
        {...props}
      />
    </div>
  );
};

export default Input;
