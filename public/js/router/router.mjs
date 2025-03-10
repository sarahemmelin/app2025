
import { initProductView } from "../view_controllers/productController.mjs";

export function handleRouting() {
    const mainComponent = document.getElementById("mainComponent");
    if (!mainComponent) {
        console.error("[ERROR] Fant ikke #mainComponent i DOM.");
        return;
    }

    const path = window.location.pathname;
    mainComponent.innerHTML = "";

    switch (path) {
        case "/":
        case "/login":
            mainComponent.appendChild(document.createElement("login-component"));
            break;

        case "/products":
            mainComponent.appendChild(document.createElement("product-list"));
            initProductView();
            break;

        case "/add-product":
            mainComponent.appendChild(document.createElement("add-product-form"));
            break;

        default:
            console.error(`[ERROR] Ruten "${path}" er ikke definert.`);
            break;
    }
}

export function navigateTo(path) {
    window.history.pushState({}, "", path);
    handleRouting();
}
