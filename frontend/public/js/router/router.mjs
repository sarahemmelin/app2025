import {initLoginView, handleLogout} from "../view_controllers/loginController.mjs";
import { initProductView } from "../view_controllers/productController.mjs";
import { DEBUG_MODE } from "../config/clientConfig.mjs";

export function navigateTo(path) {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  if (window.location.pathname === path) {
    return;
  }

  window.history.pushState({}, "", path);
  handleRouting();
}

export function handleRouting() {
  const mainComponent = document.getElementById("mainComponent");
  if (!mainComponent) {
    console.error("[ERROR router] Fant ikke #mainComponent i DOM.");
    return;
  }

  const path = window.location.pathname;
  const isLoggedIn = !!sessionStorage.getItem("authToken");

  if (path === "/products" && !isLoggedIn) {
    console.warn("[DEBUG router] Ingen token funnet! Omdirigerer til login.");
    navigateTo("/login");
    return;
  }

  if (mainComponent.dataset.currentPath === path) {
    if (DEBUG_MODE) console.log("[DEBUG router] Samme rute som før, unngår unødvendig oppdatering.");
    return;
  }
  mainComponent.dataset.currentPath = path

  mainComponent.innerHTML = "";

  switch (path) {
    case "/":
    case "/login":
      mainComponent.appendChild(document.createElement("login-component"));
      initLoginView();
      break;

    case "/products":
      const adminView = document.createElement("admin-view");
      adminView.initViewFunction = initProductView;
      mainComponent.appendChild(adminView);
      break;

    default:
      console.error(`[ERROR router] Ruten "${path}" er ikke definert.`);
      navigateTo("/");
      break;
  }
}

document.addEventListener("navigate", (event) => {
  if (DEBUG_MODE) console.log("[DEBUG router] Navigasjon event fanget:", event.detail.path);
  navigateTo(event.detail.path);
});

document.addEventListener("logoutAttempt", () => {
  handleLogout();
});

window.addEventListener("popstate", handleRouting);
