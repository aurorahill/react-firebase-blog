import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import classes from "./Modal.module.scss";
import { FiX } from "react-icons/fi";

const Modal = ({ children, open, onClose, className = "", error, message }) => {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current; // zalecane przypisanie do stałej!
    if (!modal) return;
    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [open]);
  return createPortal(
    <dialog
      ref={dialog}
      className={`${classes.modal} ${className}`}
      onClose={onClose}
    >
      <div className={classes.modal__button}>
        <button onClick={onClose}>
          <FiX />
        </button>
      </div>
      {error && <h2 className={classes.modal__title}>{error}</h2>}
      {message && <p className={classes.modal__message}>{message}</p>}
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;

Modal.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  error: PropTypes.string,
  message: PropTypes.string,
};
