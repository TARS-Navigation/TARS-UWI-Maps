// This file contains the JavaScript code for the login and sign-up form functionality.

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    document.getElementById("signUp").addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });
  
    document.getElementById("signIn").addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  });