import React from "react";

const DropdownMenu = ({ label, children }) => {
  return (
    // <details style={{zIndex: 999}}>
    //   <summary>{label}</summary>
    //   <ul>{children}</ul>
    // </details>
    <div class="dropdown dropdown-bottom dropdown-end">
      <div tabindex={0} role="button">{label}</div>
      <ul tabindex={0} class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        {children}
      </ul>
    </div>
  );
};

export default DropdownMenu;
