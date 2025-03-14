import React from "react";

const DropdownMenu = ({ label, children }) => {
  return (
    <details className="z-[1]">
      <summary>{label}</summary>
      <ul>{children}</ul>
    </details>
  );
};

export default DropdownMenu;
