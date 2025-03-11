class LoginComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.loadTemplate();
    }

    async loadTemplate() {
        try {
            const response = await fetch("/templates/login.html");
            if (!response.ok) {
                throw new Error(`HTTP-feil! status: ${response.status}`);
            }

            const text = await response.text();
            const templateWrapper = document.createElement("div");
            templateWrapper.innerHTML = text;
            const template = templateWrapper.querySelector("template");

            if (template) {
                const clone = template.content.cloneNode(true);
                this.shadowRoot.appendChild(clone);
                this.setupEventListeners();
            } else {
                console.error("[ERROR] Fant ikke template-elementet.");
            }
        } catch (error) {
            console.error("[ERROR] Feil ved lasting av template:", error);
        }
    }

    setupEventListeners() {
        const loginBtn = this.shadowRoot.getElementById("loginBtn");
    
        if (loginBtn) {
            console.log("[LoginComponent] Legger til eventlistener på knappen.");
            loginBtn.addEventListener("click", () => this.loginEvent());
        } else {
            console.error("[LoginComponent] Fant ikke login-knappen!");
        }
    }
    
    loginEvent() {
        const emailInput = this.shadowRoot.getElementById("email");
        const passwordInput = this.shadowRoot.getElementById("password");

        if (!emailInput || !passwordInput) {
            console.error("[LoginComponent] Fant ikke input-feltene!");
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        this.dispatchEvent(new CustomEvent("loginAttempt", {
            detail: { email, password },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define("login-component", LoginComponent);
