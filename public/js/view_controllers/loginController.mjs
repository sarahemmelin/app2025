import { navigateTo } from "../router/router.mjs";

export function initLoginView() {
    const mainComponent = document.getElementById("mainComponent");
    if (!mainComponent) {
        console.error("[ERROR] Fant ikke #mainComponent i DOM.");
        return;
    }

    mainComponent.innerHTML = "";
    const loginComponent = document.createElement("login-component");
    mainComponent.appendChild(loginComponent);
}

export function handleLogin(){
    localStorage.setItem("isLoggedIn", "true");
    navigateTo("/products"); 
}

export function handleLogout(){
    localStorage.removeItem("isLoggedIn");
    navigateTo("/login");
}

export function checkLoginStatus(){
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
        navigateTo("/products");
    } else {
        navigateTo("/login");
    }
}
