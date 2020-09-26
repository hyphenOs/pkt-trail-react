import React from "react";
import "./Modal.css";

const Modal = ({
  children,
  showModal
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: showModal ? "modal-container" : ""
  }, /*#__PURE__*/React.createElement("div", {
    className: showModal ? "modal-content" : ""
  }, /*#__PURE__*/React.createElement("h3", null, children)));
};

export default Modal;