import React from "react";
import { Modal } from "../Modal";

const AlertModal = ({ isChecked, setIsChecked, type, message }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "";
    }
  };

  return (
    <Modal
      id={"alertModal"}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
      title={"Alerta"}
      key={"alertModal"}
    >
      <div className="flex items-center">
        <span className="text-2xl mr-2">{getIcon()}</span>
        <p>{message}</p>
      </div>
    </Modal>
  );
};

export default AlertModal;
