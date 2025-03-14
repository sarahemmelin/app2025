import { navigateTo } from "../router/router.mjs";
import { loginUser } from "../api/api.mjs";
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
    const result = await loginUser(detail.email, detail.password);

    if (result && result.token) {
      sessionStorage.setItem("authToken", result.token);
      navigateTo("/products");
    } else {
      console.error(
        "[ERROR loginController] Innlogging feilet:",
        result?.message || "Ukjent feil"
      );
      updateLoginStatus(result?.message || "Feil ved innlogging");
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
    if (DEBUG_MODE)
      console.warn(
        "[DEBUG loginController] Ingen token funnet! Omdirigerer til login."
      );
    if (window.location.pathname !== "/login") navigateTo("/login");
    return;
  }

  if (window.location.pathname === "/login") navigateTo("/products");
}
