import React from "react";

import "../Styles/header.css";

export default function Header() {
  return (
    <div className="ui-header">
      <div className="buttons-left">
        <button>Themes</button>
      </div>

      <h1>TARS-MAPS UWI STA</h1>

      <div className="buttons-right">
        <button>Logout</button>
      </div>
    </div>
  );
}
