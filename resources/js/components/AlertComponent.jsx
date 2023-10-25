import React from "react";

export const AlertComponent = ({ mensaje, type }) => {
  let typeAlert, icon;

  switch (type) {
    case "error":
      typeAlert = "alert-error";
      icon = "cancel";
      break;
    case "warning":
      typeAlert = "alert-warning";
      icon = "error";
      break;
    case "success":
      typeAlert = "alert-success";
      icon = "check_circle";
      break;
    case "info":
      typeAlert = "alert-info";
      icon = "info";
      break;
    default:
      typeAlert = "alert-success";
      icon = "check_circle";
      break;
  }

  return (
    <div className={`alert shadow-lg ` + typeAlert}>
      <i className="material-symbols-outlined">{icon}</i>
      <span>{mensaje}</span>
    </div>
  );
};
