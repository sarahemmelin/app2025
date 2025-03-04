export function initLoginView() {
    const loginContainer = document.getElementById("login");
    if (!loginContainer) {
        console.error("[LoginController] Fant ikke #login div i dokumentet.");
        return;
    }

    const loginComponent = document.createElement("login-component");
    loginContainer.appendChild(loginComponent);
}
