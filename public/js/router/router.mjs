import {
  initLoginView,
  handleLogout,
} from "../view_controllers/loginController.mjs";
import { initProductView } from "../view_controllers/productController.mjs";

const DEBUG_MODE = true;

export function navigateTo(path) {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  if (window.location.pathname === path) {
    if (DEBUG_MODE)
      console.log(
        `[DEBUG router] Ignorerer routing – vi er allerede på ${path}`
      );
    return;
  }

  console.log("[DEBUG router] Navigerer til:", path);
  window.history.pushState({}, "", path);
  handleRouting();
}

export function handleRouting() {
  const mainComponent = document.getElementById("mainComponent");
  if (!mainComponent) {
    console.error("[ERROR router] Fant ikke #mainComponent i DOM.");
    return;
  }

  console.log(
    "[DEBUG router] Før routing, mainComponent:",
    mainComponent.innerHTML
  );

  const path = window.location.pathname;

  // Fjerner unødvendige nye instanser
  if (document.querySelector("admin-view") && path === "/products") {
    console.log(
      "[DEBUG router] Admin-view eksisterer allerede, hopper over ny rendering."
    );
    return; // Forhindrer at en ny admin-view legges til
  }

  mainComponent.innerHTML = "";

  switch (path) {
    case "/":
    case "/login":
      console.log("[DEBUG router] Kaller initLoginView()...");
      mainComponent.appendChild(document.createElement("login-component"));
      initLoginView();
      break;

    case "/products":
      console.log("[DEBUG router] Legger til admin-view...");

      if (!document.querySelector("admin-view")) {
        const adminView = document.createElement("admin-view");
        adminView.initViewFunction = initProductView;
        mainComponent.appendChild(adminView);
      } else {
        console.log(
          "[DEBUG router] Admin-view eksisterer allerede, hopper over ny rendering."
        );
      }
      break;

    default:
      console.error(`[ERROR router] Ruten "${path}" er ikke definert.`);
      break;
  }

  console.log(
    "[DEBUG router] Etter routing, mainComponent:",
    mainComponent.innerHTML
  );
}

document.addEventListener("navigate", (event) => {
  if (DEBUG_MODE)
    console.log("[DEBUG router] Navigasjon event fanget:", event.detail.path);
  navigateTo(event.detail.path);
});

document.addEventListener("logoutAttempt", () => {
  if (DEBUG_MODE) console.log("[DEBUG router] Logout event fanget!");
  handleLogout();
});
