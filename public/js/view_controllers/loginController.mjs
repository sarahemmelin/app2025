//TODO:
// [x] loginController har [ERROR loginController] for Error-meldinger. [DEBUG loginController] for debug-meldinger.
// [x] Sette alle console.log inn i en if - sjekk for debugMode (hvis noen).
// [x] Lage en felles fil for DEBUG_MODE slik at den kan toggles fra ett sted.

import { navigateTo } from "../router/router.mjs";
import { DEBUG_MODE } from "../config/clientConfig.mjs";

document.body.addEventListener("loginAttempt", (event) => {
  handleLogin(event);
});

export function initLoginView() {
  const mainComponent = document.getElementById("mainComponent");
  if (!mainComponent) {
    console.error("[ERROR loginController] Fant ikke #mainComponent i DOM.");
    return;
  }

  mainComponent.innerHTML = "";
  const loginComponent = document.createElement("login-component");
  mainComponent.appendChild(loginComponent);
}

export async function handleLogin(event) {
  const { detail } = event;
  if (!detail || !detail.email || !detail.password) {
    console.error("[ERROR loginController] Ugyldig innloggingsdata!");
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detail),
    });

    const result = await response.json();
    if (response.ok) {
      if (!result.token) {
        console.error("[ERROR loginController] Ingen token returnert fra backend!");
        return;
      }

      sessionStorage.setItem("authToken", result.token);
      if (DEBUG_MODE) console.log("[DEBUG loginController] Token lagret:", result.token);

      updateLoginStatus(result.message);
      navigateTo("/products");
    } else {
      console.error("[ERROR loginController] Innlogging feilet:", result.message);
      updateLoginStatus(result.message);
    }
  } catch (error) {
    console.error("[ERROR loginController] Feil ved innlogging:", error);
  }
}

function updateLoginStatus(message) {
  const loginComponent = document.querySelector("login-component");
  if (loginComponent) {
    loginComponent.shadowRoot.getElementById("status").textContent = message;
  }
}

export function handleLogout() {
  sessionStorage.removeItem("authToken");
  navigateTo("/login");
}

export function checkLoginStatus() {
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    if (DEBUG_MODE) console.warn("[DEBUG loginController] Ingen token funnet! Omdirigerer til login.");
    if (window.location.pathname !== "/login") navigateTo("/login");
    return;
  }

  if (DEBUG_MODE) console.log("[DEBUG loginController] Token funnet:", token);
  if (window.location.pathname === "/login") navigateTo("/products");
}
