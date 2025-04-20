import React, { useState, useEffect } from "react";
import "../Styles/mode_toggle.css";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ModeToggle() {
  const [mode, setMode] = useState("light");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.body.className = mode;
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500); // reset animation
    return () => clearTimeout(timer);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`mode-switch-fancy ${mode}`} onClick={toggleMode}>
      <div className="glow-track">
        <div className="icon-slider">
          {mode === "light" ? (
            <FaSun className={`icon ${animate ? "spin pop" : ""}`} />
          ) : (
            <FaMoon className={`icon ${animate ? "spin pop" : ""}`} />
          )}
          <div className={`sparkle ${animate ? "orbit" : ""}`}></div>
        </div>
      </div>
    </div>
  );
}
