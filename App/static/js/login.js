// This file contains the JavaScript code for the login and sign-up form functionality.

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");

  document.getElementById("signUpBtn").addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  document.getElementById("signUp").addEventListener("submit", function (e) {
    e.preventDefault();
    register();
  });

  document.getElementById("signInBtn").addEventListener("click", (event) => {
    container.classList.remove("right-panel-active");
  });
  document.getElementById("signIn").addEventListener("submit", function (e) {
    e.preventDefault();
    login();
  });

  //Route code for login and register

  async function login() {
    const form = document.getElementById("signIn");
    const formData = new FormData(form);
    console.log("Running");

    try {
      const response = await fetch("/login", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        window.location.href = "/app";
      } else {
        alert("login failed - Please check credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  async function register() {
    const form = document.getElementById("signUp");
    const formData = new FormData(form);
    console.log("Running");

    try {
      const response = await fetch("/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        window.location.href = "/app";
      } else {
        alert("User already exists");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }
});
