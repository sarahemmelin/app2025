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
    loginComponent.addEventListener("loginAttempt", handleLogin);
}

export async function handleLogin(event){
    const { email, password } = event.detail;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem("authToken", result.token);

            const loginComponent = document.querySelector("login-component");
            if (loginComponent) {
                loginComponent.shadowRoot.getElementById("status").textContent = result.message;
            }

            navigateTo("/products");  
        } else {
            const loginComponent = document.querySelector("login-component");
            if (loginComponent) {
                loginComponent.shadowRoot.getElementById("status").textContent = result.message;
            }
        }
    } catch (error){
        console.error("[ERROR] Feil ved innlogging:", error);
    }
}

export function handleLogout(){
    localStorage.removeItem("authToken");
    navigateTo("/login");
}

export function checkLoginStatus(){
    const isLoggedIn = !!localStorage.getItem("authToken");
    if (isLoggedIn) {
        navigateTo("/products");
    } else {
        navigateTo("/login");
    }
}
