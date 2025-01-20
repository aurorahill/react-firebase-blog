import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classes from "./Modal.module.scss";

const Modal = ({ children, open, onClose, className = "" }) => {
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
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
