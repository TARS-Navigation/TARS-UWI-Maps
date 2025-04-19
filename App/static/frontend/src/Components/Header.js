import React from "react";
import ModeToggle from "./ModeToggle";
import "../Styles/header.css";

export default function Header() {
  return (
    <div className="ui-header">
      <div className="header-side left">
        <ModeToggle />
      </div>
      
      <div className="buttons-center">
        <div className="logo"></div>
        <h1 className="header-title">TARS-MAPS UWI STA</h1>
        <div className="logo">{" "}</div>
      </div>
      
      

      <div className="header-side right">
        <button>Logout</button>
      </div>
    </div>
  );
}
