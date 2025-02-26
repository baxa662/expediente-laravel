import React from "react";

const DropdownMenu = ({ label, children }) => {
  return (
    <details>
      <summary>{label}</summary>
      <ul>{children}</ul>
    </details>
  );
};

export default DropdownMenu;
