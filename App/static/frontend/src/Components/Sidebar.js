import React, { useState } from "react";

import "../Styles/sidebar.css";

export default function Sidebar(props) {
  return <div className="ui-sidebar">{props.children}</div>;
}

export function SidebarItem(props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="ui-sidebar-button"
        id={props.name}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="sidebar-button-content">
          <div className="sidebar-icon">{props.icon}</div>
          <div className="siderbar-name">{props.name}</div>
          <div className="sidebar-arrow">{isOpen ? "▼" : "▶"}</div>
        </div>
      </button>

      <div className={`sidebar-dropdown ${isOpen ? "sidebar-dropdown-open" : ""}`}>
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {props.selections &&
            props.selections.map((selection, index) => (
              <li key={index} className="sidebar-dropdown-item">
                {selection}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
