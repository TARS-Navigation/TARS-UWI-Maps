import React from "react";
import ModeToggle from "./ModeToggle";
import { useState, useEffect } from "react";
import "../Styles/header.css";

export default function Header() {
  const [user, setUser] = React.useState(null);

  useEffect(async () => {
    let data = await localStorage.getItem("user");
    console.log(data);
    if (data) {
      setUser(data);
    }
  }, []);

  const logout = async () => {
      console.log("LOGGING OUT");
    try {
     let resp = await fetch("http://localhost:8080/logout", {
        method: "GET",
        credentials: "include"
      }
      );
      console.log(resp.data);
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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
        {user ? <button onClick={logout}> {user} Logout</button> : <button>Sign in</button>}
      </div>
    </div>
  );
}
