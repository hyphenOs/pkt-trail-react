import React from "react";
import "./Modal.css";

const Modal = ({ children, showModal }) => {
  return (
    <div className={showModal ? "modal-container" : ""}>
      <div className={showModal ? "modal-content" : ""}>
        <h3>{children}</h3>
      </div>
    </div>
  );
};

export default Modal;
