import {initLoginView, handleLogout,} from "../view_controllers/loginController.mjs";
import { initProductView } from "../view_controllers/productController.mjs";
import { DEBUG_MODE } from "../config/clientConfig.mjs";

export function navigateTo(path) {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  if (window.location.pathname === path) {
    if (DEBUG_MODE) console.log(`[DEBUG router] Ignorerer routing – vi er allerede på ${path}`);
    return;
  }

  if (DEBUG_MODE) console.log("[DEBUG router] Navigerer til:", path);
  window.history.pushState({}, "", path);
  handleRouting();
}

export function handleRouting() {
  console.log("[DEBUG router] Før routing, mainComponent:", document.getElementById("mainComponent").innerHTML);
  const mainComponent = document.getElementById("mainComponent");
  if (!mainComponent) {
    console.error("[ERROR router] Fant ikke #mainComponent i DOM.");
    return;
  }

  if (DEBUG_MODE) console.log("[DEBUG router] Før routing, mainComponent:", mainComponent.innerHTML);

  const path = window.location.pathname;
  const isLoggedIn = !!sessionStorage.getItem("authToken");


  if (path === "/products" && !isLoggedIn) {
    console.warn("[DEBUG router] Ingen token funnet! Omdirigerer til login.");
    navigateTo("/login");
    return;
  }

  mainComponent.innerHTML = "";

  switch (path) {
    case "/":
    case "/login":
      if (DEBUG_MODE) console.log("[DEBUG router] Kaller initLoginView()...");
      mainComponent.appendChild(document.createElement("login-component"));
      initLoginView();
      break;

    case "/products":
      if (DEBUG_MODE) console.log("[DEBUG router] Legger til admin-view...");
      const adminView = document.createElement("admin-view");
      adminView.initViewFunction = initProductView;
      mainComponent.appendChild(adminView);
      break;

    default:
      console.error(`[ERROR router] Ruten "${path}" er ikke definert.`);
      break;
  }
  console.log("[DEBUG router] Etter routing, mainComponent:", mainComponent.innerHTML);
}


document.addEventListener("navigate", (event) => {
  if (DEBUG_MODE) console.log("[DEBUG router] Navigasjon event fanget:", event.detail.path);
  navigateTo(event.detail.path);
});

document.addEventListener("logoutAttempt", () => {
  if (DEBUG_MODE) console.log("[DEBUG router] Logout event fanget!");
  handleLogout();
});
