import React from "react";
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
      <div className="buttons-left">
        <button>Themes</button>
      </div>

      <h1>TARS-MAPS UWI STA</h1>

      <div className="buttons-right">
        {user ? <button onClick={logout}> {user} Logout</button> : <button>Sign in</button>}
      </div>
    </div>
  );
}
