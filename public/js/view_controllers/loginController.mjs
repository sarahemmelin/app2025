//TODO:
// 1. loginController har [ERROR loginController] for Error-meldinger. [DEBUG loginController] for debug-meldinger.
// 2. Sette alle console.log inn i en if - sjekk for debugMode (hvis noen).

import { navigateTo } from "../router/router.mjs";

const DEBUG_MODE = true;

document.body.addEventListener("loginAttempt", (event) => {});

export function initLoginView() {
  const mainComponent = document.getElementById("mainComponent");
  if (!mainComponent) {
    console.error("[ERROR loginController] Fant ikke #mainComponent i DOM.");
    return;
  }

  mainComponent.innerHTML = "";
  const loginComponent = document.createElement("login-component");
  mainComponent.appendChild(loginComponent);

  loginComponent.addEventListener("loginAttempt", async (event) => {
    await handleLogin(event);
  });
}

export async function handleLogin(event) {
  const { detail } = event;
  if (!detail) {
    console.error(`[ERROR loginController] ${event.detail} er undefined!`);
    return;
  }

  const { email, password } = event.detail;
  if (!email || !password) {
    console.error("[ERROR loginController] E-post og passord kreves.");
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("authToken", result.token);

      const loginComponent = document.querySelector("login-component");
      if (loginComponent) {
        loginComponent.shadowRoot.getElementById("status").textContent =
          result.message;
      }

      navigateTo("/products");
    } else {
      const loginComponent = document.querySelector("login-component");
      if (loginComponent) {
        loginComponent.shadowRoot.getElementById("status").textContent =
          result.message;
      }
    }
  } catch (error) {
    console.error("[ERROR loginController] Feil ved innlogging:", error);
  }
}

export function handleLogout() {
  localStorage.removeItem("authToken");
  navigateTo("/login");
}

export function checkLoginStatus() {
  const isLoggedIn = !!localStorage.getItem("authToken");
  if (isLoggedIn) {
    navigateTo("/products");
  } else {
    navigateTo("/login");
  }
}
